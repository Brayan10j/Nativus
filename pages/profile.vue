<template>
  <v-card class="overflow-hidden">
    <v-toolbar class="overflow-hidden" flat color="grey" dark>
      <template v-slot:img="{ props }">
        <v-img
          v-bind="props"
          gradient="to top right, rgba(33,33,33,.7), rgba(11,11,11,.7)"
        ></v-img>
      </template>
      <v-toolbar-title>User Profile</v-toolbar-title>
    </v-toolbar>

    <v-dialog v-model="editeProfile" persistent max-width="600px">
      <v-card width="800" class="mx-auto">
        <v-card-title>
          <span class="headline">Edit User</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form">
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field label="First name"></v-text-field>
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
                <v-col cols="12">
                  <v-text-field color="grey" label="Email"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    color="grey"
                    label="Password"
                    type="password"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" text @click="editeProfile = false">
            Clear
          </v-btn>
          <v-btn color="grey darken-1" text @click="editeProfile = false">
            Confirm
          </v-btn>
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
          <v-img
            height="100%"
            src="https://cdn.vuetifyjs.com/images/cards/server-room.jpg"
            gradient="to top right, rgba(30,30,30,.7), rgba(30,30,30,.8)"
          >
            <v-app-bar flat color="rgba(0, 0, 0, 0)">
              <v-spacer></v-spacer>
              <v-btn color="white" icon @click="editeProfile = !editeProfile">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </v-app-bar>
            <v-row>
              <v-col class="ml-auto" cols="12" sm="12" md="3">
                <v-avatar class="profile mx-auto" size="164" tile>
                  <v-img
                    transition="slide-x-transition"
                    src="/images/user.png"
                  ></v-img>
                </v-avatar>
                <v-list-item color="rgba(0, 0, 0, .4)" dark>
                  <v-list-item-content>
                    <v-list-item-title class="title">
                      {{ $store.state.userInfo.name }}
                    </v-list-item-title>
                    <v-list-item-subtitle>{{
                      $store.state.userInfo.rol
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
                    <v-col cols="7">{{ $store.state.userInfo._id }}</v-col>
                  </v-row>
                  <v-row justify="space-between">
                    <v-col cols="5" class="my-auto text-right" tag="strong"
                      >Invitation Token:</v-col
                    >
                    <v-col cols="7">{{
                      $store.state.userInfo.codReferal
                    }}</v-col>
                  </v-row>
                </v-row>
              </v-col>
            </v-row>
          </v-img>
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
              <v-icon v-if="item">
              mdi-account
            </v-icon>
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

  </v-card>

</template>

<script>
const avatars = [
  "?accessoriesType=Blank&avatarStyle=Circle&clotheColor=PastelGreen&clotheType=ShirtScoopNeck&eyeType=Wink&eyebrowType=UnibrowNatural&facialHairColor=Black&facialHairType=MoustacheMagnum&hairColor=Platinum&mouthType=Concerned&skinColor=Tanned&topType=Turban",
  "?accessoriesType=Sunglasses&avatarStyle=Circle&clotheColor=Gray02&clotheType=ShirtScoopNeck&eyeType=EyeRoll&eyebrowType=RaisedExcited&facialHairColor=Red&facialHairType=BeardMagestic&hairColor=Red&hatColor=White&mouthType=Twinkle&skinColor=DarkBrown&topType=LongHairBun",
  "?accessoriesType=Prescription02&avatarStyle=Circle&clotheColor=Black&clotheType=ShirtVNeck&eyeType=Surprised&eyebrowType=Angry&facialHairColor=Blonde&facialHairType=Blank&hairColor=Blonde&hatColor=PastelOrange&mouthType=Smile&skinColor=Black&topType=LongHairNotTooLong",
  "?accessoriesType=Round&avatarStyle=Circle&clotheColor=PastelOrange&clotheType=Overall&eyeType=Close&eyebrowType=AngryNatural&facialHairColor=Blonde&facialHairType=Blank&graphicType=Pizza&hairColor=Black&hatColor=PastelBlue&mouthType=Serious&skinColor=Light&topType=LongHairBigHair",
  "?accessoriesType=Kurt&avatarStyle=Circle&clotheColor=Gray01&clotheType=BlazerShirt&eyeType=Surprised&eyebrowType=Default&facialHairColor=Red&facialHairType=Blank&graphicType=Selena&hairColor=Red&hatColor=Blue02&mouthType=Twinkle&skinColor=Pale&topType=LongHairCurly",
];

const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default {
  data() {
    return {
      active: [],
      avatar: null,
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
        { text: "Registration Date", value: "dateCreated", class: "text-lg-subtitle-1" },
        { text: "Pilgrim Generated", value: "cycronsGen" , class: "text-lg-subtitle-1" },
      ],
      events: [],
      input: null,
      nonce: 0,
    };
  },
  apollo: {
    transactions: {
      query: require("../api/server/queries/transactions.gql"),
      /*variables() { return {
        user: this.$store.state.userInfo._id,
      }}
      */
      //variables: {user: this.$store.state.userInfo._id}
    },
    users: {
      query: require("../api/server/queries/users.gql"),
      fetchPolicy: "cache-and-network",
    },
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

      const code = this.$store.state.userInfo.codReferal;

      return this.users == undefined ? [] : this.users.filter((user) => user.registrationCode === code);
    },
    filterTransactions() {

      const id = this.$store.state.userInfo._id;

      return this.transactions == undefined ? [] : this.transactions.filter((transaction) => transaction.user === id);
    },

    timeline() {
      return this.events.slice().reverse();
    },
  },

  watch: {
    selected: "randomAvatar",
  },

  methods: {
    onImageSelected(file) {
      file ? (this.imageSeleted = file) : null;
    },
    async fetchUsers(item) {
      // Remove in 6 months and say
      // you've made optimizations! :)
      await pause(500);

      return fetch("https://jsonplaceholder.typicode.com/users")
        .then((res) => res.json())
        .then((json) => item.children.push(...json))
        .catch((err) => console.warn(err));
    },
    randomAvatar() {
      this.avatar = avatars[Math.floor(Math.random() * avatars.length)];
    },
  },
};
</script>

<style>
</style>
