<template>
  <v-data-table :headers="headers" :items="validateRol" class="elevation-1" disable-pagination
      hide-default-footer>
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>USERS</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>

        <v-dialog v-model="dialogeditUser" max-width="500px">
          <v-card>
            <v-card-title class="text-lg-h6">
              <span class="headline text-lg-h6">Edit User</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="6">
                    <v-select
                      :items="select"
                      v-model="editedItem.rol"
                      label="Rol"
                      item-value="text"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-select
                      multiple
                      :items="permissions"
                      v-model="editedItem.permissions"
                      label="Permissions"
                      item-value="text"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="4" class="px-0" fluid>
                    <v-switch v-model="verify" label="Verify"></v-switch>
                    <v-switch v-model="active" label="Active"></v-switch>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
              <v-btn color="blue darken-1" text @click="editUser"> Save </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-btn
        @click="editItem(item)"
        small
        min-width="20px"
        width="20 px"
        class="ma-1"
      >
        <v-icon color="blue" small> mdi-pencil </v-icon>
      </v-btn>
    </template>
    <template v-slot:[`item.verify`]="{ item }">
      {{item.isAdmin || item.isSuperUser || verify ? "YES" : "NO"}}
    </template>
    <template v-slot:[`item.active`]="{ item }">
      {{item.isAdmin || item.isSuperUser || active ? "YES" : "NO"}}
    </template>
  </v-data-table>
</template>


<script>
import { mapMutations } from "vuex";
export default {

  data: () => ({
    permissions:[
    "News",
    "Courses",
    "Market Updates",
    "Webinars",
    "Events",
    "Investments",
    "The Brain"
  ],
    dialogeditUser: false,
    dialogDelete: false,
    verify: false,
    active: true,
    headers: [
      {
        text: "Name",
        align: "start",
        sortable: false,
        value: "name",
        class: "text-lg-subtitle-1"
      },
      { text: "Rol", value: "rol", class: "text-lg-subtitle-1" },
      { text: "License", value: "licenses", class: "text-lg-subtitle-1" },
      { text: "Verify", value: "verify", class: "text-lg-subtitle-1" },
      { text: "Created", value: "dateCreated", class: "text-lg-subtitle-1" },
      { text: "Active", value: "active", class: "text-lg-subtitle-1" },
      { text: "Actions", value: "actions", sortable: false, class: "text-lg-subtitle-1" },
    ],
    select: [{ text: "SUPERUSER" }, { text: "USER" }],
    editedIndex: -1,
    nameLicenses: [],
    editedItem: {},
    defaultItem: {
      name: "",
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0,
    },
  }),
  apollo: {
    users: {
      query: require("../api/server/queries/users.gql"),
      fetchPolicy: "cache-and-network",
    },
    licenses: {
      query: require("../api/server/queries/licenses.gql"),
      fetchPolicy: "cache-and-network",
      //pollInterval: 7000, //puede cambiarse esto a una subscriptionMore
    },
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    validateRol: function () {
      if(this.users == undefined){
        return []
      }else{
        return this.users.filter(function (item) {
        return item.isAdmin == false;
      });
      }

    },

  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  methods: {
    ...mapMutations(["sendUserInfo"]),

    editItem(item) {
      this.editedIndex = this.users.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogeditUser = true;
    },
    async editUser() {
      let id = this.editedItem._id;
      this.editedItem.rol == "SUPERUSER"? this.editedItem.isSuperUser = true : false
      delete this.editedItem._id;
      delete this.editedItem.__typename;
      await this.$apollo
        .mutate({
          mutation: require("../api/server/mutations/users/editUser.gql"),
          variables: { _id: id, data: this.editedItem },
        })
        .then(async (data) => {
          await this.$apollo.queries.users.refresh();
          console.log(data);
        });
      this.close()
    },

    close() {
      this.dialogeditUser = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
  },
};
</script>
