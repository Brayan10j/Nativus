export const state = () => ({
  user: {},
  userInfo: {},
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
  sendPermissions(state, data) {
    state.userInfo.permissions = data;
  },
  ON_AUTH_STATE_CHANGED_MUTATION(state, { authUser, claims, token }) {
    if (!authUser) {
      this.$router.push('/singUpx');
      return "no auth";
    }
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
  async onAuthStateChangedAction({ commit, dispatch }, { authUser, claims, token }) {
    if (!authUser) {
      //this.app.router.push('/');
      console.log("no auth");
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
