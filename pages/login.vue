<template>
  <v-layout justify-center>
    <v-container fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <!--<v-img
            class="mx-auto my-15"
            src="/images/logo.png"
            max-width="270"
          ></v-img>-->
          <v-card class="elevation-12 mx-auto" width="400">
            <v-toolbar class="overflow-hidden" flat color="#4c4c53" dark>
              <template v-slot:img="{ props }">
                <v-img
                  v-bind="props"
                  gradient="to top right, rgba(3,32,24,.1), rgba(39,42,57,.7)"
                ></v-img>
              </template>
              <v-toolbar-title>Login</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form>
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
              </v-form>
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
                >Log in</v-btn
              >
            </v-card-actions>
          </v-card>
          <v-row align="center" justify="center">
            Don't have an account?
            <v-btn text color="#787b7f" to="/singUp"> SIGN UP </v-btn></v-row
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
    var imageURLs = [
      // We assign in an array the list of URL/filename we want as background
      "/images/wallPapers/1.jpg",
      "/images/wallPapers/2.png",
      "/images/wallPapers/3.jpeg",
    ];
    var num = Math.floor(Math.random() * imageURLs.length);
    this.wallPaper = imageURLs[num];

    let deferredPrompt;

    if (process.client) {
      window.addEventListener("beforeinstallprompt", (e) => {
        console.log(e);

        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        console.log(deferredPrompt);
        deferredPrompt.prompt();
        // Update UI notify the user they can install the PWA
        showInstallPromotion();
      });
    }
  },
  methods: {
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
          });
        this.overlay = false;
        this.$router.push("/dashboard");
      } catch (err) {
        this.errord.description = "Wrong token";
        this.alerta = true;

        this.overlay = false;
      }
    },
  },
};
</script>
