<template>
  <div>
    <v-tabs v-model="model" centered background-color="#424242CC">
      <v-tab v-for="(itemTab, index) in $store.state.categories" :key="index">
        {{ itemTab.name }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="model" style="background-color: transparent">
      <v-tab-item
        v-for="(itemTab, index) in $store.state.categories"
        :key="index"
      >
        <v-row v-if="isAccess" class="ml-14" no-gutters>
          <v-col v-for="(item, index) in filter" :key="index">
            <Post :item="item" />
          </v-col>
        </v-row>

        <v-col v-if="!isAccess" align-self="center">
          <v-row>
            <v-img
              class="mx-auto my-10"
              src="/icon.png"
              max-width="370"
            ></v-img>
          </v-row>
          <v-row align="center" align-content="center">
            <h1 class="mx-auto my-10 text--black">Buy Wood Coins</h1>
          </v-row>
        </v-col>
      </v-tab-item>
    </v-tabs-items>

    <v-btn
      v-if="$store.state.userInfo.isAdmin"
      class="mx-2"
      fab
      dark
      color="primary"
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
      <v-form ref="form" @submit.prevent="addPost" lazy-validation>
        <v-card>
          <v-card-title>
            <span class="headline"> New Post </span>
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
                    v-model.number="formAdd.price"
                    label="Price (optional)"
                    prefix="$"
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
            <v-btn color="blue darken-1" text @click="dialogAdd = false">
              Close
            </v-btn>
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
                <ck-editor dark v-model="formAdd.description" />
              </client-only>

              <v-btn color="grey darken-3" @click="dialogDesc = false">
                Confirm
              </v-btn>
            </v-card>
          </v-dialog>
        </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialogDesc: false,
      dialogAdd: false,
      overlay: false,
      model: "tab-1",
      menu: false,
      date: new Date().toISOString().substr(0, 10),
      imageSeleted: null,
      filesSeleted: null,
      formAdd: {
        tittle: "",
        description: "<p></p>",
        category: "",
        image: "/images/default.jpeg",
        author: "",
        price: 0,
        date: new Date().toISOString().substr(0, 10),
        files: [],
      },
    };
  },
  apollo: {
    posts: {
      query: require("../api/server/queries/posts.gql"),
      pollInterval: 7000, //puede cambiarse esto a una subscriptionMore
    },
  },
  methods: {
    onImageSelected(file) {
      file ? (this.imageSeleted = file) : null;
    },
    onFilesSelected(file) {
      file ? (this.filesSeleted = file) : null;
      console.log(file);
    },
    async addPost(event) {
      this.overlay = true;
    
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
          await this.$apollo.queries.posts.refresh();
          this.overlay = false;
          this.$toast.success("Post add");
          this.dialogAdd = false;
        });
    },
  },
  computed: {
    filter: function () {
      let categories = this.$store.state.categories.map((c) => c.name);
      let name = categories[this.model];
      this.formAdd.category = name;
      return this.posts == undefined // llamaralo desde el init en el store
        ? []
        : this.posts.filter((post) => post.category == name);
    },
    isAccess: function () {
      let categories = this.$store.state.categories.map((c) => c.name);
      let name = categories[this.model];
      return this.$store.state.userInfo.isAdmin ||
        this.$store.state.userInfo.isSuperUser
        ? true
        : this.$store.state.userInfo.permissions.includes(name);
    },
  },
};
</script>

