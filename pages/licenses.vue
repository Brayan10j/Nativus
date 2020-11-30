<template>
<div>
  <v-btn
        v-if="$store.state.userInfo.isAdmin"
        class="mx-2"
        fab
        dark
        color="indigo"
        fixed
        right
        bottom
        @click="dialog = true"
      >
        <v-icon dark> mdi-plus </v-icon>
      </v-btn>
<v-data-table :headers="headers" :items="licenses" hide-default-footer disable-pagination class="elevation-1">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>LICENSES </v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-card-title class="text-lg-h6">
              <span class="headline text-lg-h6">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="10">
                    <v-text-field
                      v-model="editedItem.name"
                      label="Name"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-select
                      :items="select"
                      v-model="editedItem.duration"
                      label="Duration Months"
                      item-value="text"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model.number="editedItem.price"
                      label="Price"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-combobox
                      v-model="editedItem.permission"
                      :items="perm"
                      label="Permissions"
                      multiple
                      chips
                    ></v-combobox>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
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
              <v-btn color="blue darken-1" text @click="closeDelete"
                >Cancel</v-btn
              >
              <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                >OK</v-btn
              >
              <v-spacer></v-spacer>
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
      <v-btn
        @click="deleteItem(item)"
        small
        min-width="20px"
        width="20 px"
        class="ma-1">
      <v-icon color="red" small > mdi-delete </v-icon>
      </v-btn>
    </template>
    <template v-slot:no-data> </template>
  </v-data-table>
</div>

</template>
<script>
export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: "Name",
        align: "start",
        sortable: false,
        value: "name",
        class: "text-lg-subtitle-1"
      },
      { text: "Permissions", value: "permission", class: "text-lg-subtitle-1" },
      { text: "Duration", value: "duration", class: "text-lg-subtitle-1" },
      { text: "Price", value: "price",class: "text-lg-subtitle-1" },
      { text: "Actions", align: "center", value: "actions", sortable: false, class: "text-lg-subtitle-1" },
    ],
    select: [
      { text: "1 Month" },
      { text: "2 Months" },
      { text: "3 Months" },
      { text: "4 Months" },
      { text: "5 Months" },
      { text: "6 Months" },
      { text: "7 Months" },
      { text: "8 Months" },
      { text: "9 Months" },
      { text: "10 Months" },
      { text: "11 Months" },
      { text: "12 Months" },
    ],
    perm: [
      "News",
      "Courses",
      "Investments",
      "Events",
      "Webinars",
      "Markert Updates",
      "The brain",
    ],
    editedIndex: -1,
    editedItem: {
      name: "",
      price: 0,
      duration: "",
      permission: [],
    },
    defaultItem: {
      name: "",
      price: 0,
      duration: "",
      permission: [],
    },
  }),
  apollo: {
    licenses: {
      query: require("../api/server/queries/licenses.gql"),
      fetchPolicy: "cache-and-network",
      //pollInterval: 7000, //puede cambiarse esto a una subscriptionMore
    },
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New License" : "Edit License";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },
  methods: {
    editItem(item) {
      this.editedIndex = this.licenses.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.licenses.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      await this.$apollo
        .mutate({
          mutation: require("../api/server/mutations/licenses/deleteLicense.gql"),
          variables: { _id: this.editedItem._id },
        })
        .then(async (data) => {
          await this.$apollo.queries.licenses.refresh();
          console.log(data); // mensajes de respuesta
        });
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    async save() {
      if (this.editedIndex > -1) {
        let id = this.editedItem._id;
        delete this.editedItem._id;
        delete this.editedItem.__typename;
        await this.$apollo
          .mutate({
            mutation: require("../api/server/mutations/licenses/editLicense.gql"),
            variables: { _id: id, data: this.editedItem },
          })
          .then(async (data) => {
            //event.target.reset();
            await this.$apollo.queries.licenses.refresh();
            console.log(data);
          });
      } else {
        await this.$apollo
          .mutate({
            mutation: require("../api/server/mutations/licenses/addLicense.gql"),
            variables: this.editedItem,
          })
          .then(async (data) => {
            //event.target.reset();
            await this.$apollo.queries.licenses.refresh();
            console.log(data);
          });
      }
      this.close();
    },
  },
};
</script>
<style>
.v-data-table__mobile-table-row td:first-child{ border-top: 4px solid  rgba(49, 49, 49);}
</style>
