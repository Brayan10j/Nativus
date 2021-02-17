<template >
  <v-app>
    <v-navigation-drawer v-model="drawer" :clipped="clipped" fixed app>
      <v-list class="mx-auto img-center">
        <v-list-item class="mx-auto">
          <v-list-item-content>
            <v-list-item-avatar size="100">
              <v-img max-width="100" :src="$store.state.userInfo.photo"></v-img>
            </v-list-item-avatar>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link to="/profile">
          <v-list-item-content class="title text-center">
            <v-list-item-title>
              {{ $store.state.userInfo.name }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <br />

      <v-tooltip top max-width="200">
        <template v-slot:activator="{ on, attrs }">
          <v-row align="center" justify="space-around" rounded>
            <v-btn
              color="primary"
              elevation="9"
              @click="balance = !balance"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon  color="black" left> mdi-cash-multiple </v-icon>
              <span
                style=" color: black "
                >Wood Coins : {{ $store.state.userInfo.balance }}
              </span>
            </v-btn>
          </v-row>
        </template>
        <span>
          Inserisci qui il token che ti viene dato dopo l'acquisto dei wood coin
          ricorda che un 20% dei tuoi coin verra automaticamente transformato in
          pilgrim coins</span
        >
      </v-tooltip>
      <v-tooltip top max-width="200">
        <template v-slot:activator="{ on, attrs }">
          <v-sheet
            color="secondary"
            elevation="6"
            height="60"
            width="150"
            class="mt-n7 subtitle-2 d-flex align-end mx-auto"
            rounded="xl"
            v-bind="attrs"
            v-on="on"
            ><p style=" color: black "
              class="mx-auto mb-0 text-subtitle-1 font-weight-black"
            >
              Pilgrim Coins :
              {{ $store.state.userInfo.crypto }}
            </p></v-sheet
          >
        </template>
        <span>
          I pilgrim coins fanno aumentare l'eco istema del tuo portafoglio,
          invitando token ad amici riceverai coins che utilizzerai per
          acquistare eventi o servizi sull'intera piattaforma</span
        >
      </v-tooltip>

      <br />
      <v-divider></v-divider>
      <v-list height="5">
        <v-list-item to="/dashboard" v-if="$store.state.userInfo.isAdmin">
          <v-list-item-icon>
            <v-icon v-text="'mdi-view-dashboard'"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="'Dashboard'"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          to="/insinght"
          v-if="
            $store.state.userInfo == undefined
              ? false
              : $store.state.userInfo.isAdmin ||
                $store.state.userInfo.isSuperUser
              ? true
              : $store.state.userInfo.permissions.length > 0
          "
        >
          <v-list-item-icon>
            <v-icon v-text="'mdi-home'"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="'HOME'"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/favorite" v-if="!$store.state.userInfo.isAdmin">
          <v-list-item-icon>
            <v-icon v-text="'mdi-heart'"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="'I miei contenuti'"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!--<v-list-item
          to="/brain"
          v-if="
            $store.state.userInfo.permissions == undefined
              ? false
              : $store.state.userInfo.isAdmin ||
                $store.state.userInfo.isSuperUser ||
                $store.state.userInfo.permissions.includes('The brain')
          "
        >
          <v-list-item-icon>
            <v-icon v-text="'mdi-brain'"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="'The Brain'"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        -->

        <v-list-item
          to="/transaccions"
          v-if="
            $store.state.userInfo == undefined
              ? false
              : $store.state.userInfo.isAdmin
          "
        >
          <v-list-item-icon>
            <v-icon v-text="'mdi-swap-horizontal-bold'"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="'Transazasioni'"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          to="/licenses"
          v-if="
            $store.state.userInfo == undefined
              ? false
              : $store.state.userInfo.isAdmin
          "
        >
          <v-list-item-icon>
            <v-icon v-text="'mdi-license'"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="'Licenze'"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          to="/users"
          v-if="
            $store.state.userInfo == undefined
              ? false
              : $store.state.userInfo.isAdmin
          "
        >
          <v-list-item-icon>
            <v-icon v-text="'mdi-account-group'"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="'Utenti'"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/tokens" v-if="$store.state.userInfo.isAdmin">
          <v-list-item-icon>
            <v-icon v-text="'mdi-dock-window'"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="'Tokens'"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          to="/suscriptions"
          v-if="
            $store.state.userInfo == undefined
              ? false
              : !$store.state.userInfo.isAdmin
          "
        >
          <v-list-item-icon>
            <v-icon v-text="'mdi-playlist-check'"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="'License'"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-row class="mt-4" align="center" justify="space-around" rounded>
          <v-btn @click="logOut" color="red darken-4" elevation="9" rounded>
            log out
            <v-icon right> mdi-export </v-icon>
          </v-btn>
        </v-row>
        <v-row class="mt-4" align="center" justify="space-around">
          <v-tooltip bottom v-model="showToken">
            <template v-slot:activator="{ attrs }">
              <v-btn v-bind="attrs" color="gray darken-4" @click="copyText">
                Token d'invito
              </v-btn>
            </template>
            <span
              >{{ $store.state.userInfo.codReferal }} Copied in ClipBoard</span
            >
          </v-tooltip>
        </v-row>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>
        <!--<v-img
          max-height="50"
          width="200"
          contain
          src="/images/logo.png"
        ></v-img>-->
      </v-toolbar-title>
      <v-spacer />
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="primary"
            min-width="36"
            class="px-1 rounded-circle"
            @click="contact = !contact"
          >
            <v-icon v-bind="attrs" v-on="on">mdi-email</v-icon>
          </v-btn>
        </template>
        <span>Supporto</span>
      </v-tooltip>
    </v-app-bar>
    <v-dialog v-model="contact" persistent max-width="600px">
      <v-overlay :value="overlay">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
      <v-card>
        <v-card-title>
          <span class="headline">Contact Us</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="12" md="6">
                <v-text-field
                  label="Your Name*"
                  required
                  v-model="formEmail.name"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="6">
                <v-text-field
                  label="Email*"
                  required
                  v-model="formEmail.email"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  outlined
                  name="input-7-4"
                  label="Description"
                  v-model="formEmail.message"
                ></v-textarea>
              </v-col>
              <v-col cols="12" sm="6">
                <v-autocomplete
                  :items="['Information', 'Question', 'Shopping', 'Others']"
                  label="Subject"
                  v-model="formEmail.subject"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field label="Phone Number"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="contact = false">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="sendEmail"> Send </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="balance" persistent max-width="600px">
      <v-overlay :value="overlay">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
      <v-card>
        <v-card-title>
          <span class="headline">Billing</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  required
                  label="Insert your code"
                  v-model="code"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="balance = false">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="addBalance"> Send </v-btn>
        </v-card-actions>
        <v-overlay :absolute="absolute" :value="alerta" :opacity="opacity">
          <v-alert
            :value="alerta"
            color="red darken-2"
            type="error"
            border="top"
            transition="scale-transition"
            >{{ errord.description }}
            <v-btn
              color="white"
              elevation="3"
              class="ml-3"
              right
              icon
              small
              @click="alerta = !alerta"
              ><v-icon dark> mdi-close </v-icon></v-btn
            ></v-alert
          >
        </v-overlay>
      </v-card>
    </v-dialog>
    <v-main class="fondo">
      <v-container fluid>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
    <v-snackbar v-model="snackbar" :timeout="timeout" color="success">
      {{ textSnackbar }}

      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  //middleware: "persistent",
  data() {
    return {
      showToken: false,
      email: "",
      selectedItem: 1,
      code: "",
      infoUser: this.isAccess,
      overlay: false,
      snackbar: false,
      alerta: false,
      absolute: true,
      opacity: 0.8,
      textSnackbar: "",
      timeout: 4000,
      errord: {
        description: "",
      },
      transaction: {
        user: "",
        description: "purcharse balance",
        credits: "",
        date: new Date().toISOString().substr(0, 10),
      },
      formEmail: {
        name: "",
        subject: "",
        email: "",
        message: "",
      },
      defaultEmail: {
        name: "",
        subject: "",
        email: "",
        message: "",
      },
      clipped: true,
      drawer: true,
      fixed: true,
      contact: false,
      balance: false,
      right: true,
      wallPaper: "",
    };
  },

  mounted() {
    var num = Math.floor(Math.random() * 4 + 1);
    this.wallPaper = `https://firebasestorage.googleapis.com/v0/b/pilgrim-a07fc.appspot.com/o/images%2Fwallpapers%2F${num}.jpg?alt=media&token=2c2df7ac-7ee0-48c4-8226-a9d338a6a482`;
  },
  methods: {
    copyText() {
      this.showToken = !this.showToken;
      navigator.clipboard.writeText(this.$store.state.userInfo.codReferal);
    },
    ...mapMutations(["sendUserInfo", "sendBalance"]),
    async logOut() {
      try {
        await this.$fireAuth.signOut();
        localStorage.removeItem("email");
        this.$router.push("/login");
      } catch (err) {
        console.log(err);
      }
    },
    async addBalance() {
      try {
        await this.$apollo
          .mutate({
            mutation: require("../api/server/mutations/addBalance.gql"),
            variables: {
              _id: this.$store.state.userInfo._id,
              code: this.code,
            },
          })
          .then(async ({ data }) => {
            console.log(data);
            this.sendUserInfo(data.addBalance);
            this.$toast.success("Balance added successfully.");
            this.balance = false;
          });
      } catch (error) {
        this.$toast.error("Wrong token");
        this.balance = false;
      }
    },
    async sendEmail() {
      this.overlay = true;
      await this.$apollo
        .mutate({
          mutation: require("../api/server/mutations/sendEmail.gql"),
          variables: this.formEmail,
        })
        .then(async (data) => {
          this.overlay = false;
          this.textSnackbar = "Email Sent";
          this.snackbar = true;
          this.contact = false;
          this.formEmail = this.defaultEmail;
          console.log(data);
        });
    },
  },
  computed: {
    verify() {
      if (this.$store.state.userInfo.permissions == undefined) {
        return false;
      } else {
        this.$store.state.userInfo.permissions.includes("The brain")
          ? $store.state.userInfo.permissions.length > 1
          : $store.state.userInfo.permissions.length > 0;
      }
    },
  },
};
</script>

<style>
::-webkit-scrollbar {
  display: none;
}

.fondo {
  height: 100%;
  background-image: url("/images/background.jpeg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
}
</style>
