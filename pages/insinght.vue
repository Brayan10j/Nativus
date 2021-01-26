<template>
  <div>
    <v-tabs v-model="model" centered color="grey darken-1">
      <v-tab
        v-for="(itemTab, index) in $store.state.categories"
        :key="index"

      >
        {{ itemTab.name }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="model" class="my-2">
      <v-tab-item
        v-for="(itemTab, index) in $store.state.categories"
        :key="index"
        class="px-2"
      >
        <v-row v-if="isAccess(itemTab.name)">
          <v-col
            cols="12"
            lg="3"
            v-for="(item, index) in filter"
            :key="index"
          >
            <v-card
              height="350"
              class="mx-auto"
              width="300"
              @click.stop="showItem(item)"
              elevation="16"
            >
              <v-img
                class="white--text align-end"
                height="200px"
                :src="item.image"
              >
              </v-img>
              <v-card-subtitle class="pb-0 mb-3">
                {{ item.date }}
                <v-card-actions
                  class="d-flex justify-end mt-n8 mb-n2"
                  v-if="$store.state.userInfo.isAdmin"
                >
                  <v-icon
                    color="blue"
                    class="mx-3"
                    @click.stop="editItem(item)"
                  >
                    mdi-pencil
                  </v-icon>

                  <v-icon color="red" @click.stop="deleteItem(item)">
                    mdi-delete
                  </v-icon>
                </v-card-actions>
              </v-card-subtitle>
              <v-card-title>{{ item.tittle }}</v-card-title>
            </v-card>
          </v-col>
        </v-row>
      </v-tab-item>
    </v-tabs-items>

    <v-btn
      v-if="$store.state.userInfo.isAdmin"
      class="mx-2"
      fab
      dark
      color="indigo"
      fixed
      right
      bottom
      @click="dialogAdd = true"
    >
      <v-icon dark> mdi-plus </v-icon>
    </v-btn>
    <v-dialog v-model="dialogAdd" max-width="800px" persistent>
      <v-overlay :value="overlay">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
      <v-form ref="form" @submit.prevent="save()" lazy-validation>
        <v-card>
          <v-card-title>
            <span class="headline">{{
              editedIndex === -1 ? "New Post" : "Edit Post"
            }}</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="12" md="8">
                  <v-text-field
                    label="Tittle"
                    required
                    v-model="formAdd.tittle"
                    >{{ formAdd.tittle }}</v-text-field
                  >
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-select
                    v-model="formAdd.category"
                    :items="$store.state.categories.map((c) => c.name)"
                    label="Category"
                    required
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    v-model="formAdd.shortDesc"
                    label="Short Description"
                    hint="Short description of the new"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-menu
                    ref="menu"
                    v-model="menu"
                    :close-on-content-click="false"
                    :return-value.sync="formAdd.date"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="formAdd.date"
                        label="Select day"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="date" no-title scrollable>
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="menu = false">
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.menu.save(date)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12">
                  <v-btn
                    color="gray darken-2"
                    @click="dialogDesc = !dialogDesc"
                  >
                    Add Description
                  </v-btn>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-file-input
                    v-model="imageSeleted"
                    small-chips
                    truncate-length="50"
                    label="Photo"
                    @change="onImageSelected"
                    prepend-icon="mdi-camera"
                  ></v-file-input>
                  <v-img
                    v-if="editedIndex > -1"
                    :src="formAdd.image"
                    max-width="400px"
                    aspect-ratio="2"
                  >
                  </v-img>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-file-input
                    v-model="filesSeleted"
                    small-chips
                    truncate-length="50"
                    label="File"
                    prepend-icon="mdi-file"
                    @change="onFilesSelected"
                  ></v-file-input>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close"> Close </v-btn>
            <v-btn color="blue darken-1" text type="submit"> Save </v-btn>
          </v-card-actions>

          <v-dialog
            v-model="dialogDesc"
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
          >
            <v-card>
              <v-toolbar dark color="grey darken-3">
                <v-spacer></v-spacer>
                <v-toolbar-items>
                  <v-btn dark text @click="dialogDesc = false"> Close </v-btn>
                </v-toolbar-items>
              </v-toolbar>
              <client-only>
                <!-- this component will only be rendered on client-side -->
                <rich-editor dark v-model="formAdd.description" />
              </client-only>

              <v-btn color="grey darken-3" @click="dialogDesc = false">
                Confirm
              </v-btn>
            </v-card>
          </v-dialog>
        </v-card>
      </v-form>
    </v-dialog>
    <v-dialog v-model="dialogDelete" max-width="500px" persistent>
      <v-card>
        <v-card-title class="headline"
          >Are you sure you want to delete this item?</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="deletePost">OK</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogShow"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="grey darken-3">
          <v-toolbar-title>{{ formAdd.category }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="close"> Close </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-list class="mx-auto" max-width="900px" three-line subheader>
          <v-card-title class="text-center justify-center py-6">
            <h3 class="font-weight-bold display-3">
              {{ formAdd.tittle }}
            </h3>
          </v-card-title>
          <v-container class="mx-auto">
            <v-row align="center" align-content="center">
              <v-col cols="12" sm="12" md="12">
                <v-img
                  aspect-ratio="2"
                  class="white--text align-end"
                  height="50%"
                  :src="formAdd.image"
                >
                </v-img>
              </v-col>
            </v-row>
          </v-container>
          <v-card-text class="text--primary">
            <div v-html="formAdd.description"></div>

            <v-alert
              v-if="formAdd.files[0]"
              border="top"
              colored-border
              type="info"
              elevation="2"
            >
              Download files
              <a :href="formAdd.files[0]" target="_blank" download>HERE</a>
            </v-alert>
          </v-card-text>
        </v-list>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" :timeout="timeout" color="success">
      {{ textSnackbar }}

      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";

export default {
  data() {
    return {
      categoryName: "",
      overlay: false,
      dialogDesc: false,
      snackbar: false,
      textSnackbar: "",
      timeout: 4000,
      dialogAdd: false,
      dialogShow: false,
      dialogDelete: false,
      dialog3: false,
      model: "tab-1",
      menu: false,
      date: new Date().toISOString().substr(0, 10),
      imageSeleted: null,
      filesSeleted: null,
      editedIndex: -1,
      content: "",
      absolute: true,
      opacity: 1,
      formAdd: {
        tittle: "",
        description: "<p></p>",
        category: "",
        image: "/images/default.jpeg",
        author: "",
        shortDesc: "",
        date: new Date().toISOString().substr(0, 10),
        files: [],
      },
      defaultForm: {
        tittle: "",
        description: "",
        category: "",
        image: "/images/default.jpeg",
        author: "",
        shortDesc: "",
        date: new Date().toISOString().substr(0, 10),
        files: [],
      },
    };
  },
  apollo: {
    posts: {
      query: require("../api/server/queries/posts.gql"),
      fetchPolicy: "cache-and-network",
      pollInterval: 7000, //puede cambiarse esto a una subscriptionMore
    },
  },
  methods: {
    //mutaciones de la store
    ...mapMutations({
      cambiarRol: "cambiarRol",
    }),
    onImageSelected(file) {
      file ? (this.imageSeleted = file) : null;
    },
    onFilesSelected(file) {
      file ? (this.filesSeleted = file) : null;
      console.log(file);
    },
    async addPost(event) {
      this.overlay = true;
      console.log(this.formAdd.image);
      if (this.imageSeleted != null) {
        const storageRef = this.$fireStorage.ref(
          `/images/posts/${this.imageSeleted.name}`
        );
        var fileTask = await storageRef
          .put(this.imageSeleted)
          .then((snapshot) => {
            return snapshot.ref.getDownloadURL().then((url) => {
              this.formAdd.image = url;
              this.imageSeleted = null;
              return url;
            });
          })
          .catch((error) => {
            console.error("Error uploading image", error);
          });
      }
      if (this.filesSeleted != null) {
        const storageRef = this.$fireStorage.ref(
          `/files/posts/${this.filesSeleted.name}`
        );
        var fileTask = await storageRef
          .put(this.filesSeleted)
          .then((snapshot) => {
            return snapshot.ref.getDownloadURL().then((url) => {
              this.formAdd.files.push(url);
              console.log(url);
              this.filesSeleted = null;
              return url;
            });
          })
          .catch((error) => {
            console.error("Error uploading image", error);
          });
      }

      await this.$apollo
        .mutate({
          mutation: require("../api/server/mutations/posts/addPost.gql"),
          variables: this.formAdd,
        })
        .then(async (data) => {
          //event.target.reset();
          await this.$apollo.queries.posts.refresh();
          this.overlay = false;
          this.textSnackbar = "Post added";
          this.snackbar = true;
          console.log(data);
        });
    },
    async editPost() {
      this.overlay = true;
      if (this.imageSeleted != null) {
        const storageRef = this.$fireStorage.ref(
          `/images/posts/${this.imageSeleted.name}`
        );
        var fileTask = await storageRef
          .put(this.imageSeleted)
          .then((snapshot) => {
            return snapshot.ref.getDownloadURL().then((url) => {
              this.imageSeleted = null;
              this.formAdd.image = url;
              return url;
            });
          })
          .catch((error) => {
            console.error("Error uploading image", error);
          });
      }
      let id = this.formAdd._id;
      delete this.formAdd._id;
      delete this.formAdd.__typename;
      await this.$apollo
        .mutate({
          mutation: require("../api/server/mutations/posts/editPost.gql"),
          variables: { _id: id, data: this.formAdd },
        })
        .then(async (data) => {
          //event.target.reset();
          await this.$apollo.queries.posts.refresh();
          this.overlay = false;
          this.textSnackbar = data.data.editPost
            ? "Post edited"
            : "Post no found";
          this.snackbar = true;
          console.log(data);
        });
    },
    editItem(item) {
      this.editedIndex = this.posts.indexOf(item);
      this.formAdd = Object.assign({}, item);
      this.dialogAdd = true;
    },

    showItem(item) {
      this.editedIndex = this.posts.indexOf(item);
      this.formAdd = Object.assign({}, item);
      this.dialogShow = true;
    },

    deleteItem(item) {
      this.formAdd = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async deletePost() {
      this.overlay = true;
      await this.$apollo
        .mutate({
          mutation: require("../api/server/mutations/posts/deletePost.gql"),
          variables: { _id: this.formAdd._id },
        })
        .then(async (data) => {
          await this.$apollo.queries.posts.refresh();
          this.overlay = false;
          this.textSnackbar = data.data.deletePost
            ? "Post deleted"
            : "Post no found";
          this.snackbar = true;
          console.log(data); // mensajes de respuesta
        });
      this.closeDelete();
    },

    close() {
      this.editedIndex = -1;
      this.dialogAdd = false;
      this.dialogShow = false;
      this.$nextTick(() => {
        this.formAdd = Object.assign({}, this.defaultForm);
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.formAdd = Object.assign({}, this.defaultForm);
        this.editedIndex = -1;
      });
    },
    isAccess(name) {
      this.categoryName = name;
      var access =
        this.$store.state.userInfo == undefined
          ? false
          : this.$store.state.userInfo.isAdmin ||
            this.$store.state.userInfo.isSuperUser;
      if (access) {
        return true;
      } else {
        if (this.$store.state.userInfo == undefined) {
          return false;
        } else {
          return this.$store.state.userInfo.permissions.includes(name);
        }
      }
    },
    filerCategory(name) {
      this.formAdd.category = name;
      return this.posts == undefined
        ? []
        : this.posts.filter((post) => post.category == name);
    },

    async save() {
      if (this.editedIndex > -1) {
        await this.editPost();
      } else {
        await this.addPost();
      }
      this.close();
    },
  },
  computed: {
    filter: function () {

      let categories = this.$store.state.categories.map((c) => c.name);
      let name = categories[this.model];
      this.formAdd.category = name;
      return this.posts == undefined
        ? []
        : this.posts.filter((post) => post.category == name);
    },
  },
};
</script>

<style>
</style>
