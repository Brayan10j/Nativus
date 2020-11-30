
<template>
  <v-app >
    <v-main>
      <v-container
        fluid
      >
      <nuxt />
      </v-container>
    </v-main>
    <v-footer
      app
    >
      <span class="white--text">&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    props: {
      source: String,
    },
    data: () => ({
      drawer: null,
    }),
  }
</script>
