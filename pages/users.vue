<template >
  <div v-if="$store.state.userInfo.isAdmin">
    <v-data-table
      :headers="headers"
      :items="validateRol"
      class="elevation-1"
      disable-pagination
      hide-default-footer
    >
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
                        :items="types"
                        v-model="editedItem.type"
                        label="Type"
                        item-value="text"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-select
                        multiple
                        :items="$store.state.categories.map((c) => c.name)"
                        v-model="editedItem.permissions"
                        label="Permissions"
                        item-value="text"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4" class="px-0" fluid>
                      <v-switch
                        v-model="editedItem.verify"
                        label="Verify"
                      ></v-switch>
                      <v-switch
                        v-model="editedItem.active"
                        label="Active"
                      ></v-switch>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Cancel
                </v-btn>
                <v-btn color="blue darken-1" text @click="editUser">
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.licenses`]="{ item }">
        <v-btn small min-width="20px" width="20 px" class="ma-1" @click="showLicenses(item)">
          {{ item.licenses.length }}
        </v-btn>
        <v-dialog v-model="dialogLic" max-width="500px">
          <v-data-table
            dense
            :headers="headersLic"
            :items="editedItem.licenses"
            item-key="name"
            class="elevation-1"
            disable-pagination
            hide-default-footer
          ></v-data-table>
        </v-dialog>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn
          @click="editItem(item)"
          small
          min-width="20px"
          width="20 px"
          class="ma-1"
        >
          <v-icon color="blue" small> mdi-pencil </v-icon> </v-btn
        >
      </template>
    </v-data-table>
  </div>
</template>


<script>
import { mapMutations } from "vuex";  // se puede hacer sin llamarlo .commit
export default {
  data: () => ({
    dialogLic: false,
    types: ["FOUNDER", "TEAMPILGRIM"],
    dialogeditUser: false,
    dialogDelete: false,
    headers: [
      {
        text: "Name",
        align: "start",
        sortable: false,
        value: "name",
        class: "text-lg-subtitle-1",
      },
      { text: "Type", value: "type", class: "text-lg-subtitle-1" },
      { text: "Rol", value: "rol", class: "text-lg-subtitle-1" },
      { text: "Licenses", value: "licenses", class: "text-lg-subtitle-1" },
      { text: "Verify", value: "verify", class: "text-lg-subtitle-1" },
      { text: "Created", value: "dateCreated", class: "text-lg-subtitle-1" },
      { text: "Active", value: "active", class: "text-lg-subtitle-1" },
      {
        text: "Actions",
        value: "actions",
        sortable: false,
        class: "text-lg-subtitle-1",
      },
    ],
    headersLic: [
        {
          text: "License",
          align: "start",
          sortable: false,
          value: "name",
        },
        { text: "Start Date", value: "dateStart" },
        { text: "Finish Date", value: "dateFinish" },
      ],
    select: [{ text: "SUPERUSER" }, { text: "USER" }],
    editedIndex: -1,
    nameLicenses: [],
    editedItem: {},
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
      if (this.users == undefined) {
        return [];
      } else {
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
    showLicenses(item){
      this.editedIndex = this.users.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogLic = true;
    },
    editItem(item) {
      this.editedIndex = this.users.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogeditUser = true;
    },
    async editUser() {
      let id = this.editedItem._id;
      this.editedItem.type != "" ? (this.editedItem.rol = "SUPERUSER") : "";
      this.editedItem.rol == "SUPERUSER"
        ? (this.editedItem.isSuperUser = true)
        : false;
      delete this.editedItem._id;
      delete this.editedItem.__typename;
      this.editedItem.licenses.forEach(l => {
        delete l.__typename;
      });

      await this.$apollo
        .mutate({
          mutation: require("../api/server/mutations/users/editUser.gql"),
          variables: { _id: id, data: this.editedItem },
        })
        .then(async (data) => {
          await this.$apollo.queries.users.refresh();
          console.log(data);
        });
      this.close();
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
