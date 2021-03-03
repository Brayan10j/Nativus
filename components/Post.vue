<template>
  <v-card
    height="350"
    width="300"
    class="mt-5"
    @click.stop="dialogShow = true"
    elevation="16"
  >
    <v-img class="white--text align-end" height="200px" :src="item.image">
    </v-img>
    <v-card-subtitle class="pb-0">
      {{ item.date }}
    </v-card-subtitle>
    <br />
    <v-card-actions
      class="d-flex justify-end mt-n8 mb-n2"
      v-if="$store.state.userInfo.isAdmin"
    >
      <v-icon color="blue" class="mx-3" @click.stop="dialogEdit = true">
        mdi-pencil
      </v-icon>

      <v-icon color="red" @click.stop="dialogDelete = true">
        mdi-delete
      </v-icon>
    </v-card-actions>
    <v-card-actions class="d-flex justify-end mt-n8 mb-n2 mt-2" v-else>
      <v-btn
        text
        small
        color="success"
        v-if="item.price != 0"
        @click.stop="dialogBuy = true"
      >
        ACQUISTA PER {{ item.price }} WOODCOINS
      </v-btn>
      <v-btn
        icon
        :color="isFavorite(item) ? 'red' : '#ffffff80'"
        @click.stop="addFavorite(item)"
      >
        <v-icon> mdi-heart </v-icon>
      </v-btn>
    </v-card-actions>

    <v-card-title class="ajustador">{{ item.tittle }}</v-card-title>
    <v-dialog v-model="dialogBuy" max-width="290">
      <v-card>
        <v-card-title class="headline"> Vuoi comprare ? </v-card-title>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text @click="dialogBuy = false"> Disagree </v-btn>

          <v-btn text @click.stop="buy(item)"> Agree </v-btn>
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
          <v-toolbar-title>{{ item.category }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="dialogShow = false"> Close </v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <v-card-title class="text-center justify-center py-6">
          <h3 class="font-weight-bold display-3 text-black">
            {{ item.tittle }}
          </h3>
        </v-card-title>
        <v-container class="mx-auto">
          <v-row align="center" align-content="center">
            <v-col cols="8">
              <div v-html="item.description"></div>
            </v-col>
            <v-col cols="4" align-self="center" class="mx-auto">
              <v-img :src="item.image"> </v-img>
              <br/>
              <v-btn
                small
                color="success"
                v-if="item.price != 0"
                @click.stop="dialogBuy = true"
                elevation="12"
                outlined
                rounded
              >
                ACQUISTA PER {{ item.price }} WOODCOINS
              </v-btn>
              <br/>
              <br/>
              <v-alert
                v-if="item.files[0]"
                border="top"
                colored-border
                type="info"
                elevation="2"
              >
                Download files
                <a :href="item.files[0]" target="_blank" download>HERE</a>
              </v-alert>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogDelete" max-width="500px" persistent>
      <v-card>
        <v-card-title class="headline"
          >Are you sure you want to delete this item?</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogDelete = false"
            >Cancel</v-btn
          >
          <v-btn color="blue darken-1" text @click="deletePost">OK</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogEdit" max-width="800px" persistent>
      <v-overlay :value="overlay">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
      <v-form ref="form" @submit.prevent="editPost" lazy-validation>
        <v-card>
          <v-card-title>
            <span class="headline">Edit Post </span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="12" md="8">
                  <v-text-field label="Tittle" required v-model="item.tittle">{{
                    item.tittle
                  }}</v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-select
                    v-model="item.category"
                    :items="$store.state.categories.map((c) => c.name)"
                    label="Category"
                    required
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    v-model.number="item.price"
                    label="Price (optional)"
                    prefix="$"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-menu
                    ref="menu"
                    v-model="menu"
                    :close-on-content-click="false"
                    :return-value.sync="item.date"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="item.date"
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
                  <v-img :src="item.image" max-width="400px" aspect-ratio="2">
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
            <v-btn color="blue darken-1" text @click="dialogEdit = false">
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
                <ck-editor dark v-model="item.description" />
              </client-only>

              <v-btn color="grey darken-3" @click="dialogDesc = false">
                Confirm
              </v-btn>
            </v-card>
          </v-dialog>
        </v-card>
      </v-form>
    </v-dialog>
  </v-card>
</template>

<script>
export default {
  props: {
    item: {},
  },
  data() {
    return {
      dialogBuy: false,
      overlay: false,
      dialogDesc: false,
      dialogEdit: false,
      dialogShow: false,
      dialogDelete: false,
      menu: false,
      date: new Date().toISOString().substr(0, 10),
      imageSeleted: null,
      filesSeleted: null,
    };
  },
  methods: {
    async buy(item) {
      try {
        if (this.$store.state.userInfo.balance < item.price) {
          throw "Balance insuficient";
        }
        await this.$apollo
          .mutate({
            mutation: require("../api/server/mutations/buy.gql"),
            variables: {
              _idUser: this.$store.state.userInfo._id,
              _idProduct: item._id,
            },
          })
          .then(async ({ data }) => {
            this.$store.commit("UPDATE_BALANCE", data.buy.balance);
            this.$toast.success("Purchase made");
            this.dialogBuy = false;
          });
      } catch (error) {
        this.$toast.error(error);
        this.dialogBuy = false;
      }
    },
    isFavorite(item) {
      let favoritePost =
        this.$store.state.userInfo.favorites == undefined
          ? []
          : this.$store.state.userInfo.favorites.map((c) => c.tittle);
      return favoritePost.includes(item.tittle);
    },
    async addFavorite(itemIN) {
      let item;
      item = Object.assign({}, itemIN);
      let favorites;
      delete item._id;
      if (this.isFavorite(item)) {
        let favoritePost = this.$store.state.userInfo.favorites.map(
          (c) => c.tittle
        );
        var i = favoritePost.indexOf(item.tittle);
        let fp = JSON.parse(
          JSON.stringify(this.$store.getters["getUser"].favorites)
        );
        fp.splice(i, 1);
        favorites = fp;
      } else {
        favorites = [item].concat(
          this.$store.state.userInfo.favorites == undefined
            ? []
            : this.$store.state.userInfo.favorites
        ); // para prevenir errores ( agregar favorites a todos los usuarios en la base de datos)
      }
      await this.$apollo
        .mutate({
          mutation: require("../api/server/mutations/users/editUser.gql"),
          variables: {
            _id: this.$store.state.userInfo._id,
            data: { favorites: favorites },
          },
        })
        .then(({ data }) => {
          this.$store.commit("sendUserInfo", data.editUser);
        });
    },
    onImageSelected(file) {
      file ? (this.imageSeleted = file) : null;
    },
    onFilesSelected(file) {
      file ? (this.filesSeleted = file) : null;
      console.log(file);
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
              this.item.image = url;
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
              this.item.files.push(url);
              console.log(url);
              this.filesSeleted = null;
              return url;
            });
          })
          .catch((error) => {
            console.error("Error uploading image", error);
          });
      }
      let id = this.item._id;
      delete this.item._id;
      delete this.item.__typename;
      await this.$apollo
        .mutate({
          mutation: require("../api/server/mutations/posts/editPost.gql"),
          variables: { _id: id, data: this.item },
        })
        .then((data) => {
          this.overlay = false;
          this.$toast.success("Post edited");
          this.dialogEdit = false;
        });
    },
    async deletePost() {
      this.overlay = true;
      await this.$apollo
        .mutate({
          mutation: require("../api/server/mutations/posts/deletePost.gql"),
          variables: { _id: this.item._id },
        })
        .then((data) => {
          this.overlay = false;
          this.$toast.success("Post delete");
        });
      this.dialogDelete = false;
    },
  },
};
</script>

<style scoped>
.ajustador {
  word-break: normal;
}
#html p {
  color: black;
}
</style>


