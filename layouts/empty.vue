
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
    var imageURLs = [
      // We assign in an array the list of URL/filename we want as background
      "/images/wallPapers/1.jpg",
      "/images/wallPapers/2.jpg",
      "/images/wallPapers/3.jpg",
    ];
    var num = Math.floor(Math.random() * imageURLs.length);
    this.wallPaper = imageURLs[num];
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
