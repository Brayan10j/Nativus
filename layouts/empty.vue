
<template>
  <v-app>

      <v-main :style="{ backgroundImage: `url(${wallPaper})` }" class="fondo">
        <v-container fluid>
          <nuxt />
        </v-container>
      </v-main>

  </v-app>
</template>

<script>
export default {
  data: () => ({
    drawer: null,
    wallPaper: "",
  }),
  mounted() {
    var num = Math.floor((Math.random() * 3) +1);
    this.wallPaper = `https://firebasestorage.googleapis.com/v0/b/pilgrim-a07fc.appspot.com/o/images%2Fwallpapers%2F${num}.jpg?alt=media&token=2c2df7ac-7ee0-48c4-8226-a9d338a6a482`;
  },
};
</script>

<style>

.fondo {
  height: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
