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
  plugins: [],

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
    "@nuxtjs/firebase",
    'nuxt-i18n',
    '@nuxtjs/toast',
  ],
  toast: {
    duration: 1000,

},
  i18n: {
    detectBrowserLanguage: {
      useCookie: true,
      alwaysRedirect: true
    }
  },
  apollo: {
    clientConfigs: {
      default: {
        httpEndpoint: (() => {
          if (process.env.NODE_ENV === "development") {
            return "http://localhost:3000/graphql";
          } else {
            return "https://platform.ahumpilgrim.org/graphql";
          }
        })(),
        inMemoryCacheOptions: {
          addTypename: false, // para quitar el __typename
        },
      }
    }
  },
  pwa: {
    meta: {
      theme_color: "#ffffff"
    },
    workbox: {
      importScripts: [
        // ...
        "/firebase-auth-sw.js"
      ],
      // by default the workbox module will not install the service worker in dev environment to avoid conflicts with HMR
      // only set this true for testing and remember to always clear your browser cache in development
      dev: process.env.NODE_ENV === 'development'
    }
  },
  firebase: {
    config: {
      apiKey: "AIzaSyBdV29XYKmKlqPs1lOKb3qcGMIk9obxfYg",
      authDomain: "pilgrim-a07fc.firebaseapp.com",
      databaseURL: "https://pilgrim-a07fc-default-rtdb.firebaseio.com",
      projectId: "pilgrim-a07fc",
      storageBucket: "pilgrim-a07fc.appspot.com",
      messagingSenderId: "50369241596",
      appId: "1:50369241596:web:0061117cd25de7b85ed279"
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
          primary:'#fdde07',
          accent: '#cae365',
          secondary: '#cae365',
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        },
        light: {
          primary: '#BDBDBD',
          secondary: '#CFD8DC',
          accent: '#CFD8DC',
          error: '#FF5252',
          info: '#CFD8DC',
          success: '#4CAF50',
          warning: '#FFC107',
        }
      }
    }
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {}
};
