<template>
  <v-row>
    <v-col v-if="$store.state.userInfo.isAdmin" cols="12">
      <v-toolbar flat>
        <v-toolbar-title>CATEGORIES</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-btn
          @click="dialogCategory = true"
          small
          min-width="20px"
          width="20 px"
          class="ma-1"
        >
          <v-icon color="success" small> mdi-plus-circle-outline </v-icon>
        </v-btn>
      </v-toolbar>
      <v-list>
        <v-list-item
          v-for="(item, index) in $store.state.categories"
          :key="index + 1"
          multiple
        >
          <v-list-item-content>
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn small min-width="20px" width="20 px" @click="editItem(item)">
              <v-icon color="blue" small> mdi-pencil </v-icon>
            </v-btn>
          </v-list-item-action>
          <v-list-item-action>
            <v-btn
              @click="deleteItem(item)"
              small
              min-width="20px"
              width="20 px"
            >
              <v-icon color="red" small> mdi-delete </v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
      <v-dialog v-model="dialogCategory" max-width="300px">
        <v-card>
          <v-card-title class="text-lg-h6">
            <span class="headline text-lg-h6">{{
              this.editedIndex === -1 ? "New Category" : "Edit Category"
            }}</span>
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="editedItem.name"
              solo
              label="Name"
              clearable
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="resetItem()">
              Cancel
            </v-btn>
            <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogDelete" max-width="500px">
        <v-card>
          <v-card-title class="headline"
            >Are you sure you want to delete this item?</v-card-title
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="resetItem">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click="deleteCategory">OK</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>

    <v-col cols="12">
      <v-row>
        <v-col>
          <v-card elevation="2">
            <v-card-text class="my-4 text-center title">
              Total pilgrims : {{ totalPilgrim() }}
            </v-card-text>
          </v-card>
        </v-col>
        <v-col>
          <v-card elevation="2">
            <v-card-text class="my-4 text-center title">
              Founders :
              {{ users.filter((user) => user.type === "FOUNDER").length }}
            </v-card-text>
          </v-card>
        </v-col>
        <v-col>
          <v-card elevation="2">
            <v-card-text class="my-4 text-center title">
              TeamPilgrim :
              {{ users.filter((user) => user.type === "TEAMPILGRIM").length }}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-btn block @click="dialogTree = true"> albero di riferimento </v-btn>
      <br />
      <v-data-table
        :headers="headers"
        :items="users"
        class="elevation-1"
        disable-pagination
        hide-default-footer
        sort-by="crypto"
        sort-desc
      >
      <template v-slot:[`item.crypto`]="{ item }">
        {{ item.crypto % 1 == 0 ? item.crypto  :item.crypto.toFixed(8)}}
      </template>
      </v-data-table>
    </v-col>
    <v-dialog v-model="dialogTree" max-width="500px">
      <v-card>
        <v-treeview :items="arbol()">
          <template v-slot:prepend="{}">
            <v-icon>mdi-account </v-icon>
          </template>
          <template v-slot:append="{ item }">
            <v-btn fab x-small @click="showInfoUser(item)">
              <v-icon>mdi-information </v-icon>
            </v-btn>
          </template>
        </v-treeview>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogUserInfo" max-width="500px">
      <v-col
        class="d-flex text-center"
      >
              <v-card
                class="pt-6 mx-auto"
                flat
                max-width="400"
              >
                <v-card-text>
                  <v-avatar size="88">
                    <v-img
                      :src="userSelected.photo"
                      class="mb-6"
                    ></v-img>
                  </v-avatar>
                  <h3 class="headline mb-2">
                    {{ userSelected.name }}
                  </h3>
                  <div class="blue--text mb-2">
                    {{ userSelected.email }}
                  </div>
                  <div class="blue--text subheading font-weight-bold">
                    {{ userSelected.rol }}
                  </div>
                </v-card-text>
                <v-divider></v-divider>
                <v-row class="text-left" tag="v-card-text">
                  <v-col class="text-right mr-4 mb-2" tag="strong" cols="5">
                    Pilgrim:
                  </v-col>
                  <v-col>{{ userSelected.crypto }}</v-col>
                  <v-col class="text-right mr-4 mb-2" tag="strong" cols="5">
                    Pilgrim Generated:
                  </v-col>
                  <v-col>{{ userSelected.cryptoGen }}</v-col>
                  <v-col class="text-right mr-4 mb-2" tag="strong" cols="5">
                    Link refer:
                  </v-col>
                  <v-col>
                    <a :href="`https://platform.ahumpilgrim.org/singUp/?token=${userSelected.codReferal}`" target="_blank">{{
                      userSelected.codReferal
                    }}</a>
                  </v-col>
                </v-row>
              </v-card>
              </v-col>
            </v-dialog>
  </v-row>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  data: () => ({
    userSelected:{
      photo: "",
      name: "",
      email: "",
      rol: ""
    },
    users: [],
    content: "",
    dialogUserInfo: false,
    dialogTree: false,
    dialogCategory: false,
    dialogDelete: false,
    category: "",
    categoryID: "",
    editedIndex: -1,
    editedItem: {
      name: "",
    },
    headers: [
      {
        text: "Id(User)",
        align: "start",
        sortable: false,
        value: "_id",
        class: "text-lg-subtitle-1",
      },
      { text: "Name", value: "name", class: "text-lg-subtitle-1" },
      { text: "Pilgrim", value: "crypto", class: "text-lg-subtitle-1" },
    ],
  }),
  methods: {
    showInfoUser(item){
      let user = this.users.filter((user) =>user._id === item.id)
      this.userSelected = user[0]
      this.dialogUserInfo = true
    },
    arbol() {
      let arbol = [
        {
          id: this.$store.state.userInfo._id,
          name: this.$store.state.userInfo.name,
          children: this.armarArbol(
            this.users.filter(
              (user) =>
                user.registrationCode === this.$store.state.userInfo.codReferal
            )
          ),
        },
      ];
      return arbol;
    },
    armarArbol(refers) {
      let ctx = this;
      let users = this.users;
      let arbol = [];
      refers.forEach(function (userIn) {
        let refersRef = users.filter(
          (user) => user.registrationCode === userIn.codReferal
        );
        arbol.push({
          id: userIn._id,
          name: userIn.name,
          children: ctx.armarArbol(refersRef),
        });
      });
      return arbol;
    },
    resetItem() {
      this.editedIndex = -1;
      this.editedItem.name = "";
      this.dialogCategory = false;
      this.dialogDelete = false;
    },
    editItem(item) {
      this.editedIndex = this.$store.state.categories.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogCategory = true;
    },
    deleteItem(item) {
      this.editedIndex = this.$store.state.categories.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    ...mapMutations(["sendCategories"]),
    async save() {
      if (this.editedIndex > -1) {
        let id = this.editedItem._id;
        delete this.editedItem._id;
        delete this.editedItem.__typename;
        await this.$apollo
          .mutate({
            mutation: require("../api/server/mutations/editCategory.gql"),
            variables: { _id: id, data: this.editedItem },
          })
          .then(async ({ data }) => {
            this.dialogCategory = false;
            this.sendCategories(data.editCategory);
            this.resetItem();
          });
      } else {
        await this.$apollo
          .mutate({
            mutation: require("../api/server/mutations/addCategory.gql"),
            variables: { data: this.editedItem },
          })
          .then(async ({ data }) => {
            this.dialogCategory = false;
            this.sendCategories(data.addCategory);
            this.resetItem();
          });
      }
    },
    deleteCategory: async function () {
      console.log(this.editedItem);
      await this.$apollo
        .mutate({
          mutation: require("../api/server/mutations/deleteCategory.gql"),
          variables: { _id: this.editedItem._id },
        })
        .then(async ({ data }) => {
          this.dialogDelete = false;
          this.sendCategories(data.deleteCategory);
          this.resetItem(); // enviar el dialog como parametro
        });
    },
    totalPilgrim() {
      let total = 0;
      if (this.users != undefined) {
        this.users.forEach((u) => {
          total = total + u.crypto;
        });
        return total;
      }
    },
  },
  apollo: {
    users: {
      query: require("../api/server/queries/users.gql"),
      fetchPolicy: "cache-and-network",
      prefetch: false,
    },
  },
};
</script>
