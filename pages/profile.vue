<template>
  <v-card class="overflow-hidden">
    <v-toolbar class="overflow-hidden" flat color="grey" dark>
      <template v-slot:img="{ props }">
        <v-img
          v-bind="props"
          gradient="to top right, rgba(33,33,33,.7), rgba(11,11,11,.7)"
        ></v-img>
      </template>
      <v-toolbar-title>User Profile</v-toolbar-title> </v-toolbar
    >

    <v-dialog v-model="editeProfile" persistent max-width="600px">
      <v-card width="800" class="mx-auto">
        <v-card-title>
          <span class="headline">Edit User</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form">
              <v-col>
                <v-row>
                  <v-avatar class="profile mx-auto" size="164" tile>
                    <v-img
                      transition="slide-x-transition"
                      :src="
                        $store.state.userInfo == undefined
                          ? ''
                          : $store.state.userInfo.photo
                      "
                    ></v-img>
                  </v-avatar>
                </v-row>
                <v-row>
                  <v-file-input
                    v-model="imageSeleted"
                    small-chips
                    truncate-length="50"
                    label="Photo"
                    @change="onImageSelected"
                    prepend-icon="mdi-camera"
                  ></v-file-input>
                </v-row>
                <v-row>
                  <v-text-field v-model="editItem.name"></v-text-field>
                </v-row>
              </v-col>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" text @click="editeProfile = false">
            Clear
          </v-btn>
          <v-btn color="grey darken-1" text @click="editUser"> Confirm </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-tabs :vertical="!$vuetify.breakpoint.mobile" color="grey darken-1">
      <v-tab>
        <v-icon left> mdi-account </v-icon>
        Account
      </v-tab>
      <v-tab>
        <v-icon left> mdi-account-group </v-icon>
        Referral List
      </v-tab>
      <v-tab>
        <v-icon left> mdi-access-point </v-icon>
        Transactions
      </v-tab>

      <v-tab-item>
        <v-card
          class="mx-auto my-3"
          max-width="1200"
          :height="height"
          tile
          elevation="12"
        >
            <v-app-bar flat color="rgba(0, 0, 0, 0)">
              <v-spacer></v-spacer>

              <v-menu left bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on">
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>

                <v-list>
                  <v-list-item @click="editItemUser($store.state.userInfo)">
                    <v-list-item-title>Edit Profile</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="dialogDelete = true">
                    <v-list-item-title>Delete Account</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-app-bar>
            <v-row>
              <v-col class="ml-auto" cols="12" sm="12" md="3">
                <v-avatar class="profile mx-auto" size="164" tile>
                  <v-img
                    transition="slide-x-transition"
                    :src="
                      $store.state.userInfo == undefined
                        ? ''
                        : $store.state.userInfo.photo
                    "
                  ></v-img>
                </v-avatar>
                <v-list-item color="rgba(0, 0, 0, .4)" dark>
                  <v-list-item-content>
                    <v-list-item-title class="title">
                      {{
                        $store.state.userInfo == undefined
                          ? ""
                          : $store.state.userInfo.name
                      }}
                    </v-list-item-title>
                    <v-list-item-subtitle>{{
                      $store.state.userInfo == undefined
                        ? ""
                        : $store.state.userInfo.rol
                    }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
              <v-col class="mr-auto" cols="12" sm="12" md="6">
                <v-row
                  class="text-left text-caption text-sm-body-1"
                  tag="v-card-text"
                >
                  <v-row justify="space-between">
                    <v-col cols="5" class="my-auto text-right" tag="strong"
                      >Token Access:</v-col
                    >
                    <v-col cols="7">{{
                      $store.state.userInfo == undefined
                        ? ""
                        : $store.state.userInfo._id
                    }}</v-col>
                  </v-row>
                  <v-row justify="space-between">
                    <v-col cols="5" class="my-auto text-right" tag="strong"
                      >Codice invito:</v-col
                    >
                    <v-col cols="7">{{
                      $store.state.userInfo == undefined
                        ? ""
                        : $store.state.userInfo.codReferal
                    }}</v-col>
                  </v-row>
                </v-row>
              </v-col>
            </v-row>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card>
          <v-data-table
            dense
            :headers="headers"
            :items="selected"
            item-key="xxxx"
            class="elevation-1"
            disable-pagination
            hide-default-footer
          >
            <template v-slot:[`item.image`]="{ item }">
              <v-icon v-if="item"> mdi-account </v-icon>
            </template></v-data-table
          >
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat width="800" class="mr-auto">
          <v-timeline dense>
            <v-timeline-item
              fill-dot
              class="white--text mb-12"
              color="orange"
              large
            >
              <template v-slot:icon>
                <span>$</span>
              </template>
              <v-row justify="space-between">
                <v-col class="text-h6" cols="4"> Credits </v-col>
                <v-col class="text-h6" cols="4"> Description </v-col>
                <v-col class="text-right pr-7" cols="4"> Date</v-col>
              </v-row>
            </v-timeline-item>

            <v-timeline-item
              v-for="t in filterTransactions"
              :key="t._id"
              class="my-n8"
              color="green"
              small
            >
              <v-row justify="space-between">
                <v-col class="text-h6" cols="4"> {{ t.credits }} </v-col>
                <v-col cols="4" class="my-auto"> {{ t.description }} </v-col>
                <v-col class="text-right" cols="4"> {{ t.date }} </v-col>
              </v-row>
            </v-timeline-item>
            <v-timeline-item class="mb-4" hide-dot> </v-timeline-item>
          </v-timeline>
        </v-card>
      </v-tab-item>
    </v-tabs>
    <v-dialog v-model="dialogDelete" max-width="550px" persistent>
      <v-card>
        <v-card-title class="headline"
          >Are you sure you want to delete your account?</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogDelete = false"
            >Cancel</v-btn
          >
          <v-btn color="blue darken-1" text @click="alert('BORRAR')">OK</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

export default {
  data() {
    return {
      editItem: {},
      dialogDelete: false,
      active: [],
      open: [],
      imageSeleted: null,
      editeProfile: false,
      headers: [
        {
          text: "",
          align: "start",
          sortable: false,
          value: "image",
          class: "text-lg-subtitle-1"
        },
        { text: "Name", value: "name", class: "text-lg-subtitle-1" },
        { text: "Email", value: "email", class: "text-lg-subtitle-1" },
        {
          text: "Registration Date",
          value: "dateCreated",
          class: "text-lg-subtitle-1"
        },
        {
          text: "Pilgrim Generated",
          value: "cryptoGen",
          class: "text-lg-subtitle-1"
        }
      ],
      events: [],
      input: null,
      nonce: 0
    };
  },
  apollo: {
    transactions: {
      query: require("../api/server/queries/transactions.gql")
      /*variables() { return {
        user: this.$store.state.userInfo._id,
      }}
      */
      //variables: {user: this.$store.state.userInfo._id}
    },
    users: {
      query: require("../api/server/queries/users.gql"),
      fetchPolicy: "cache-and-network"
    }
  },

  computed: {
    height() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return 500;
        case "sm":
          return 360;
        case "md":
          return 360;
        case "lg":
          return 360;
        case "xl":
          return 360;
      }
    },
    selected() {
      const code =
        this.$store.state.userInfo == undefined
          ? ""
          : this.$store.state.userInfo.codReferal;

      return this.users == undefined
        ? []
        : this.users.filter(user => user.registrationCode === code);
    },
    filterTransactions() {
      const id =
        this.$store.state.userInfo == undefined
          ? ""
          : this.$store.state.userInfo._id;

      return this.transactions == undefined
        ? []
        : this.transactions.filter(transaction => transaction.user === id);
    },

    timeline() {
      return this.events.slice().reverse();
    }
  },

  methods: {
    onImageSelected(file) {
      file ? (this.imageSeleted = file) : null;
    },
    editItemUser(item) {
      this.editItem = Object.assign({}, item);
      this.editeProfile = true;
    },
    deleteItem(item) {
      this.editItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    async deleteUser() {
      await this.$apollo
        .mutate({
          mutation: require("../api/server/mutations/users/deleteUser.gql"),
          variables: { _id: this.editItem._id }
        })
        .then(async data => {
          console.log(data); // mensajes de respuesta
        });
      this.dialogDelete = false;
    },
    async editUser() {
      if (this.imageSeleted != null) {
        const storageRef = this.$fireStorage.ref(
          `/images/users/${this.editItem.email}`
        );
        var fileTask = await storageRef
          .put(this.imageSeleted)
          .then(snapshot => {
            return snapshot.ref.getDownloadURL().then(url => {
              this.editItem.photo = url;
              this.imageSeleted = null;
              return url;
            });
          })
          .catch(error => {
            console.error("Error uploading image", error);
          });
      }
      let id = this.editItem._id;
      delete this.editItem._id;
      delete this.editItem.__typename;
      await this.$apollo
        .mutate({
          mutation: require("../api/server/mutations/users/editUser.gql"),
          variables: { _id: id, data: this.editItem }
        })
        .then(async ({data}) => {
          this.$store.commit("sendUserInfo", data.editUser);
        });
      this.editeProfile = false;
    }
  }
};
</script>

<style></style>
