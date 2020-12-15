export const state = () => ({
  user: {},
  authUser: {},
  categories: ["News", "Culture", "Webinars", "Events", "Store"]
});

export const mutations = {
  sendUserInfo(state, data) {
    state.userInfo = data;
  },
  sendBalance(state, data) {
    state.userInfo.balance = data;
  },
  sendCategory(state, data) {
    state.categories = data;
  },
  ON_AUTH_STATE_CHANGED_MUTATION(state, { authUser, claims, token }) {
    if (!authUser) {
      //this.$router.push("/singUpx");
      return "no auth";
    }
    //console.log(this.app.apolloProvider);
    // you can request additional fields if they are optional (e.g. photoURL)
    const { uid, email, emailVerified, displayName, photoURL } = authUser;
    state.authUser = {
      uid,
      displayName,
      email,
      emailVerified,
      photoURL: photoURL || null, // results in photoURL being null for server auth
      // use custom claims to control access (see https://firebase.google.com/docs/auth/admin/custom-claims)
      isAdmin: claims.custom_claim
    };
  },
  SET_USER(state, user) {
    state.user = user;
  }
};

export const actions = {
  async nuxtServerInit({ commit, state }, { app }) {
    /*let email = localStorage.getItem("email");
    await this.$apollo
      .query({
        query: require("../api/server/queries/user.gql"),
        variables: { email: email },
      })
      .then(async (data) => {
        this.$store.commit("sendUserInfo", data.data.user);
        this.email = data.data.user.email;
      });*/
  },
  async onAuthStateChangedAction(
    { commit, dispatch },
    { authUser, claims, token }
  ) {
    if (!authUser) {
      //this.app.router.push('/');
      //console.log("no auth");
      return "no auth";
    }
    // you can request additional fields if they are optional (e.g. photoURL)
    const { uid, email, emailVerified, displayName, photoURL } = authUser;

    //console.log(clientApollo);
    commit("SET_USER", {
      uid,
      email,
      emailVerified,
      displayName,
      photoURL, // results in photoURL being undefined for server auth
      // use custom claims to control access (see https://firebase.google.com/docs/auth/admin/custom-claims)
      isAdmin: claims.custom_claim
    });
  }
};
