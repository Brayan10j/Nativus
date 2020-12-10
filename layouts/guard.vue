
<template>
  <v-app dark>
    <h1>error</h1>
    <NuxtLink to="/"> Home page </NuxtLink>
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



