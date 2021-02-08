export const state = () => ({
  user: {},
  authUser: {},
  categories: ["News", "Culture", "Webinars", "Events", "Store"]
});

export const getters = {
  getUser: (state) => {
    return state.userInfo;
  }
}

export const mutations = {
  sendUserInfo(state, data) {
    state.userInfo = data;
  },
  sendBalance(state, data) {
    state.userInfo.balance = data;
  },
  sendCategories(state, data) {
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
  async nuxtServerInit({ dispatch, commit }, ctx) {
    const client = ctx.app.apolloProvider.defaultClient
    await client
      .query({
        query: require("../api/server/queries/categories.gql")
      })
      .then(async (data) => {
        commit("sendCategories", data.data.categories);
      });

    if (this.$fireAuth === null) {
      throw 'nuxtServerInit Example not working - this.$fireAuth cannot be accessed.'
    }

    if (ctx.$fireAuth === null) {
      throw 'nuxtServerInit Example not working - ctx.$fireAuth cannot be accessed.'
    }

    if (ctx.app.$fireAuth === null) {
      throw 'nuxtServerInit Example not working - ctx.$fireAuth cannot be accessed.'
    }

    // INFO -> Nuxt-fire Objects can be accessed in nuxtServerInit action via this.$fire___, ctx.$fire___ and ctx.app.$fire___'

    /** Get the VERIFIED authUser from the server */
    if (ctx.res && ctx.res.locals && ctx.res.locals.user) {

      const { allClaims: claims, ...authUser } = ctx.res.locals.user
      /*
      console.info(
        'Auth User verified on server-side. User: ',
        authUser,
        'Claims:',
        claims
      )*/
      await client
      .query({
        query: require("../api/server/queries/user.gql"),
        variables: { email: authUser.email },
      })
      .then(async (data) => {
        commit("sendUserInfo", data.data.user);
      });
      await dispatch('onAuthStateChangedAction', {
        authUser,
        claims,
      })
    }else{
      ctx.redirect("/login");
    }
  },

  async onAuthStateChangedAction(
    { commit, dispatch },
    { authUser, claims }
  ) {
    if (!authUser) {
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
