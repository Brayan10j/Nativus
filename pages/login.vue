<template>
  <v-layout justify-center>
    <v-container fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-dialog v-model="dialogIOS" persistent max-width="290">
            <v-card >
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
            <v-toolbar class="overflow-hidden" flat color="#4c4c53">
              <v-toolbar-title>Login</v-toolbar-title>
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
                  color="#4c4c53"
                  prepend-icon="mdi-key"
                  type="text"
                  v-model="token"
                ></v-text-field>

            </v-card-text>
            <v-card-actions>
              <v-btn
                class="mx-auto mb-3 rounded-pill btn-text-transform"
                btn-text-transform
                elevation="12"
                min-width="250"
                color="#4c4c53"
                @click="userLogin2"
                inset
                >Login</v-btn
              >
            </v-card-actions>
          </v-card>
          <v-row align="center" justify="center">
            Don't have an account?
            <v-btn text color="blue" to="/singUp"> SIGN UP </v-btn></v-row
          >
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
        </v-col>
      </v-row>
    </v-container>
  </v-layout>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  layout: "empty",
  data() {
    return {
      isIOS: false,
      deferredPrompt: null,
      dialogIOS: false,
      banner: true,
      buttonInstall: null,
      wallPaper: "",
      alerta: false,
      absolute: true,
      opacity: 0.8,
      overlay: false,
      res: "",
      token: "",
      login: {
        email: "",
        password: "",
      },
      errord: {
        description: "",
      },
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
      this.banner = false;

      if (this.isIOS) {
        this.dialogIOS = true;
      } else {
        this.banner = false;
        // Show the install prompt
        this.deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        this.deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === "accepted") {
            console.log("User accepted the install prompt");
          } else {
            console.log("User dismissed the install prompt");
          }
        });
      }
    },
    ...mapMutations(["sendUserInfo"]),
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
        this.errord.description = "Wrong token";
        this.alerta = true;

        this.overlay = false;
      }
    },
  },
};
</script>
