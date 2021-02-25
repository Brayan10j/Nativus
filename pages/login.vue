<template>
  <v-layout justify-center>
    <v-container fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-dialog v-model="dialogIOS" persistent max-width="290">
            <v-card>
              <v-card-title class="headline justify-center">
                <img src="/icon.png" height="72" width="72" alt="Install PWA" />
                Pilgrim
              </v-card-title>
              <v-card-text class="text-center"
                ><div>
                  <p>
                    Tap
                    <img
                      src="/images/AppleShare.png"
                      className="uk-display-inline-block"
                      alt="Add to homescreen"
                      height="20"
                      width="20"
                    />
                    then &quot;Add to Home Screen&quot;
                  </p>
                </div></v-card-text
              >
              <v-card-actions class="justify-center text-center">
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" text @click="dialogIOS = false">
                  Close
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-snackbar v-model="banner" timeout="-1">
            Get our free app.
            <template v-slot:action="{ attrs }">
              <v-btn color="blue" text @click="install"> Install </v-btn>
              <v-btn color="blue" text v-bind="attrs" @click="banner = false">
                Close
              </v-btn>
            </template>
          </v-snackbar>
          <v-card class="elevation-12 mx-auto" width="400" color="#ffffff20">
            <v-toolbar class="overflow-hidden" flat color="#424242">
              <v-toolbar-title>Login</v-toolbar-title>
              <v-spacer></v-spacer>

              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon color="white" v-bind="attrs" v-on="on"
                    >mdi-information</v-icon
                  >
                </template>
                <span> Conserva il tuo token d'accesso in un posto sicuro</span>
              </v-tooltip>
            </v-toolbar>
            <v-card-text>
              <v-overlay :value="overlay">
                <v-progress-circular
                  indeterminate
                  size="64"
                ></v-progress-circular>
              </v-overlay>
              <v-text-field
                dense
                filled
                outlined
                label="Token"
                name="login"
                prepend-icon="mdi-key"
                type="text"
                v-model="token"
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-btn
                class="mx-auto mb-3 rounded-pill btn-text-transform"
                color="#424242"
                btn-text-transform
                elevation="12"
                min-width="250"
                @click="userLogin2"
                inset
                >Login</v-btn
              >
            </v-card-actions>
          </v-card>
          <v-row align="center" justify="center">
            Hai un referal token ?
            <v-btn text color="blue" to="/singUp"> Registrati</v-btn></v-row
          >
          <v-row align="center" justify="center">

            <v-btn text color="blue" @click="dialogRecovery = true"> Recovery token</v-btn></v-row
          >
        </v-col>
      </v-row>
    </v-container>
    <v-dialog v-model="dialogRecovery" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Recovery Token</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  required
                  label="Insert your email"
                  v-model="email"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogRecovery= false">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="recovery"> Send </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  layout: "empty",
  data() {
    return {
      dialogRecovery: false,
      isIOS: false,
      deferredPrompt: null,
      dialogIOS: false,
      banner: false,
      buttonInstall: null,
      wallPaper: "",
      alerta: false,
      absolute: true,
      opacity: 0.8,
      overlay: false,
      res: "",
      token: "",
      email: "",
    };
  },
  created() {
    if (process.client) {
      window.addEventListener("beforeinstallprompt", (e) => {
        // Stash the event so it can be triggered later.
        this.deferredPrompt = e;
        // Update UI notify the user they can install the PWA
        this.banner = true;
      });
      window.addEventListener("appinstalled", () => {
        this.banner = false;
      });
      // Detects if device is on iOS
      const isIos = () => {
        const userAgent = window.navigator.userAgent.toLowerCase();
        this.isIOS = /iphone|ipad|ipod/.test(userAgent);
        return this.isIOS;
      };
      // Detects if device is in standalone mode
      const isInStandaloneMode = () =>
        "standalone" in window.navigator && window.navigator.standalone;

      // Checks if should display install popup notification:
      if (isIos() && !isInStandaloneMode()) {
        this.banner = true;
      }
    }
  },
  methods: {
    install() {
      if (this.isIOS) {
        this.dialogIOS = true;
        this.banner = false;
      } else {
        this.banner = false;
        // Show the install prompt
        this.deferredPrompt.prompt();
      }
    },
    ...mapMutations(["sendUserInfo"]),
    async recovery() {
      try {
        await this.$apollo
          .query({
            query: require("../api/server/queries/user.gql"),
            variables: { email: this.email },
          })
          .then(async ({data}) => {
            if (data.user == null){
              throw "User no found"
            }
            await this.$apollo
              .mutate({
                mutation: require("../api/server/mutations/sendEmail.gql"),
                variables: {
                  name: data.user.name,
                  subject: "recovery",
                  email: data.user.email,
                  message: data.user._id,
                },
              })
              .then(async (data) => {
                this.dialogRecovery = false;
                this.$toast.success("check your email");
              });
          });
      } catch (error) {
        this.$toast.error("User no found");
        this.dialogRecovery = false;
      }
    },
    async userLogin2() {
      try {
        this.overlay = true;
        await this.$apollo
          .query({
            query: require("../api/server/queries/userID.gql"),
            variables: { _id: this.token },
          })
          .then(async (data) => {
            await this.$fireAuth.signInWithEmailAndPassword(
              data.data.userID.email,
              data.data.userID.password
            );
            this.sendUserInfo(data.data.userID);
            await localStorage.setItem("email", data.data.userID.email);
            this.overlay = false;
            this.$router.push("/insinght");
          });
      } catch (err) {
        this.overlay = false;
        this.$toast.error(err);
      }
    },
  },
};
</script>
