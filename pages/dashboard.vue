<template>
  <div>
    <v-card elevation="24"  class="mx-auto pt-5 mt-1">
      <v-carousel
        cycle
        interval="12000"
        height="730"
        max-width="900"
        hide-delimiter-background
        show-arrows-on-hover
      >
        <v-carousel-item>
          <v-sheet
            height="100%"
            class="d-flex flex-column justify-space-between align-center"
          >
            <v-img
              height="366"
              width="700"
              :src="posts == undefined ? '/images/default.jpeg' : posts[0].image == undefined ?'/images/default.jpeg':'/images/default.jpeg'"
            ></v-img>
            <v-row class="fill-height" align="center" justify="center">
              <div class="mt-1 text-sm-h6 text-md-h4">
                {{ posts == undefined ? "" : posts[0].tittle }}
              </div>
            </v-row>
          </v-sheet>
        </v-carousel-item>
        <!--<v-carousel-item>
          <v-sheet
            height="100%"
            class="d-flex flex-column justify-space-between align-center"
          >
            <v-img
              height="366"
              width="700"
              :src="posts == undefined ? '/images/default.jpeg' : posts[1].image"
            ></v-img>
            <v-row class="fill-height" align="center" justify="center">
              <div class="mt-1 text-sm-h6 text-md-h4">
                {{ posts == undefined ? "" : posts[1].tittle }}
              </div>
              <div
                class="mx-15 text-justify"
                v-html="
                  posts == undefined ? '' : posts[1].description.substr(0, 725)
                "
              ></div>
            </v-row>
          </v-sheet>
        </v-carousel-item>
        <v-carousel-item>
          <v-sheet
            height="100%"
            class="d-flex flex-column justify-space-between align-center"
          >
            <v-img
              :src="posts == undefined ? '/images/default.jpeg' : posts[2].image"
              height="366"
              width="700"
            ></v-img>
            <v-row class="fill-height" align="center" justify="center">
              <div class="mt-1 text-sm-h6 text-md-h4">
                {{ posts == undefined ? "" : posts[2].tittle }}
              </div>
              <div
                class="mx-15 text-justify"
                v-html="
                  posts == undefined ? '' : posts[2].description.substr(0, 725)
                "
              ></div>
            </v-row>
          </v-sheet>
        </v-carousel-item>-->
      </v-carousel>
    </v-card>
  </div>
</template>

<script>
export default {
  data: () => ({
    content: "",
  }),
  apollo: {
    posts: {
      query: require("../api/server/queries/posts.gql"),
      fetchPolicy: "cache-and-network",
    },
  },
};
</script>
