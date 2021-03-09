<template>
  <v-layout justify-center>
    <v-container fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="12" md="5">
          <v-dialog v-model="dialog" persistent max-width="290">
            <v-card>
              <v-card-title class="headline">
                You are registered !!
              </v-card-title>
              <v-card-text
                >your access token was sent to your email
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="#787b7f" text to="/login"> Agree </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!--<v-img
            class="mx-auto my-10"
            src="/images/logo.png"
            max-width="370"
          ></v-img>-->
          <v-toolbar class="overflow-hidden" flat color="#4c4c53" dark>
            <template v-slot:img="{ props }">
              <v-img
                v-bind="props"
                gradient="to top right, rgba(3,32,24,.1), rgba(39,42,57,.7)"
              ></v-img>
            </template>
            <v-toolbar-title>Registrazione utente</v-toolbar-title>
          </v-toolbar>
          <v-stepper v-model="e1">
            <v-overlay :value="overlay">
              <v-progress-circular
                indeterminate
                size="64"
              ></v-progress-circular>
            </v-overlay>
            <v-stepper-header>
              <v-stepper-step :complete="e1 > 1" step="1" color="info">
                Codice Invito
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="e1 > 2" step="2" color="info">
                Formulario di registrazione
              </v-stepper-step>
            </v-stepper-header>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-stepper-items >
                <v-stepper-content step="1">
                  <v-col cols="12" sm="12">
                    <v-text-field
                      dense
                      autofocus
                      filled
                      outlined
                      v-model="user.registrationCode"
                      label="Codice invito*"
                      hint="Scrivi qui il codice invito che hai ricevuto."
                      persistent-hint
                      required
                      @change="validateToken"
                    ></v-text-field>
                  </v-col>

                  <v-btn color="#787b7f" @click="validateToken"> Avanti </v-btn>

                  <v-btn color="#787b7f" @click="cancel"> Cancellare </v-btn>
                </v-stepper-content>

                <v-stepper-content step="2" >
                  <v-col cols="12">
                    <v-text-field
                      dense
                      filled
                      outlined
                      v-model="user.name"
                      label="First name*"
                      :rules="nameRules"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      dense
                      filled
                      outlined
                      v-model="user.email"
                      :rules="emailRules"
                      label="Email*"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      dense
                      filled
                      outlined
                      v-model="user.password"
                      :rules="passwordRules"
                      label="Password*"
                      type="password"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-btn  color="#787b7f" @click="singUp" :disabled="!valid">
                    Continue
                  </v-btn>

                  <v-btn text @click="cancel"> Cancel </v-btn>
                </v-stepper-content>
              </v-stepper-items>
            </v-form>
            <v-row align="center" justify="center">
              Hai già un account?
              <v-btn text color="#787b7f" to="/login"> LOGIN </v-btn></v-row
            >
          </v-stepper>

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
export default {
  layout: "empty",
  data() {
    return {
      wallPaper: "",
      dialog: false,
      e1: 1,
      alerta: false,
      absolute: true,
      opacity: 0.8,
      user: {
        name: "",
        email: "",
        codReferal: "",
        password: "",
        registrationCode: this.$route.query.token,
        licenses: [],
        rol: "USER",
        type: "",
        photo: "/images/user.png",
        balance: 0,
        crypto: 0,
        cryptoGen: 0,
        permissions: [],
        referals: [],
        favorites: [],
        isAdmin: false,
        isSuperUser: false,
        dateCreated: new Date().toISOString().substr(0, 10),
        active: true,
        verify: false,
      },
      errord: {
        description: "",
      },
      valid: true,
      name: "",
      nameRules: [
        (v) => !!v || "Name is required",
        (v) => (v && v.length <= 20) || "Name must be less than 20 characters",
      ],
      email: "",
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
      password: "",
      passwordRules: [
        (v) => !!v || "Password is required",
        (v) =>
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/.test(v) ||
          "Min. 8 characters with at least one capital letter and number ",
      ],
      code: "",
      codeRules: [
        (v) => !!v || "Code is required",
        (v) =>
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!\@#\$%\^&\*])(?=.{5,})/.test(
            v
          ) || "Code is not valid .",
      ],
      checkbox: false,
      overlay: false,
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
  },
  mounted() {
    this.$route.query.token ? this.validateToken() : console.log("sin token");
  },
  methods: {
    cancel() {
      this.$router.push("/login");
    },
    async validateToken() {
      try {
        this.overlay = true;
        await this.$apollo
          .query({
            query: require("../api/server/queries/userToken.gql"),
            variables: { codReferal: this.user.registrationCode },
          })
          .then(async (data) => {
            if (data.data.userToken) {
              this.e1 = 2;
              this.overlay = false;
            } else {
              this.$toast.error("token no found");
              this.overlay = false;
            }
          });
      } catch (error) {
        this.$toast.error(error);
      }
    },
    async singUp() {
      this.overlay = true;
      try {
        let res = await this.$fireAuth
          .createUserWithEmailAndPassword(this.user.email, this.user.password)
          .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // alert(errorMessage);
            this.errord.description = errorMessage;
            this.alerta = true;

            // ...
          });
        this.user.codReferal = res.user.uid.substr(0, 10);
        console.log(this.user);
        //
        await this.$apollo
          .mutate({
            mutation: require("../api/server/mutations/users/addUser.gql"),
            variables: { data: this.user },
          })
          .then(async (data) => {
            console.log(data);
            await this.$apollo
              .query({
                query: require("../api/server/queries/user.gql"),
                variables: { email: this.user.email },
              })
              .then(async (data) => {
                await this.$apollo
                  .mutate({
                    mutation: require("../api/server/mutations/sendEmail.gql"),
                    variables: {
                      name: this.user.name,
                      subject: "singUp",
                      email: this.user.email,
                      message: data.data.user._id,
                    },
                  })
                  .then(async (data) => {
                    console.log(data);
                  });
                this.overlay = false;
                this.dialog = true;
              });
          });
      } catch (error) {
        this.overlay = false;
        //alert(error);
        this.errord.description = error;
        this.alerta = true;
        this.$router.push("/singUp");
      }
    },
    validate() {
      if (this.$refs.form.validate()) {
        this.singUp();
      } else {
        //alert("form invalide");
        this.errord.description = "form invalide";
        this.alerta = true;
      }
    },

    reset() {
      this.$refs.form.reset();
    },
  },
};
</script>

<style>
</style>
