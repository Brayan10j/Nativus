import colors from "vuetify/es5/util/colors";
import server from "./api/server";

export default {
  // server graphgl
  hooks: {
    render: {
      async before({
        nuxt: {
          server: { app }
        }
      }) {
        await server.applyMiddleware({ app, path: "/graphql" });
        console.log(`🚀 ApolloServer ready at /graphql`);
      }
    }
  },
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: "%s",
    title: "AH-UM PILGRIM",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [{ src: "~/plugins/rich-editor", ssr: false }],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    "@nuxtjs/vuetify"
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    "@nuxtjs/axios",
    // https://go.nuxtjs.dev/pwa
    "@nuxtjs/pwa",
    "@nuxtjs/apollo",
    "@nuxtjs/firebase"
  ],
  apollo: {
    clientConfigs: {
      default: {
        httpEndpoint: (() => {
          if (process.env.NODE_ENV === "development") {
            return "http://localhost:3000/graphql";
          } else {
            return "https://cycron.herokuapp.com/graphql";
          }
        })()
      }
    }
  },
  pwa: {
    // disable the modules you don't need
    meta: false,
    icon: false,
    // if you omit a module key form configuration sensible defaults will be applied
    // manifest: false,

    workbox: {
      importScripts: [
        // ...
        "/firebase-auth-sw.js"
      ],
      // by default the workbox module will not install the service worker in dev environment to avoid conflicts with HMR
      // only set this true for testing and remember to always clear your browser cache in development
      dev: false
    }
  },
  firebase: {
    config: {
      apiKey: "AIzaSyDXFcML5pKIa1kkrL0Clm7rR59r_5R2K90",
      authDomain: "cycron-87aa7.firebaseapp.com",
      databaseURL: "https://cycron-87aa7.firebaseio.com",
      projectId: "cycron-87aa7",
      storageBucket: "cycron-87aa7.appspot.com",
      messagingSenderId: "637194624242",
      appId: "1:637194624242:web:2fb916d88977de5c3d046b"
    },
    services: {
      auth: {
        persistence: 'local', // default
        initialize: {
          onAuthStateChangedMutation: "ON_AUTH_STATE_CHANGED_MUTATION",
          onAuthStateChangedAction: "onAuthStateChangedAction"
        },
        ssr: true
      },
      storage: true
    }
  },
  serverMiddleware: ['~/api/'],
  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {},

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {}
};
