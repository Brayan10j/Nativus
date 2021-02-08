<template>
  <v-row>
    <v-col
      v-for="(item, index) in $store.state.userInfo.favorites == undefined ? [] : $store.state.userInfo.favorites "
      :key="index"
    >
      <v-card
        height="350"
        class="mx-auto"
        width="300"
        @click.stop="showItem(item)"
        elevation="16"
      >
        <v-img class="white--text align-end" height="200px" :src="item.image">
        </v-img>
        <v-card-subtitle class="pb-0 mb-3">
          {{ item.date }}
        </v-card-subtitle>
        <v-card-title>{{ item.tittle }}</v-card-title>
      </v-card>
    </v-col>
    <v-dialog
        v-model="dialogShow"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <v-card color="white">
          <v-toolbar dark color="grey darken-3">
            <v-toolbar-title>{{ itemSelected.category }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark text @click="dialogShow = false"> Close </v-btn>
            </v-toolbar-items>
          </v-toolbar>

          <v-card-title class="text-center justify-center py-6">
            <h3
              style="color: black"
              class="font-weight-bold display-3 text-black"
            >
              {{ itemSelected.tittle }}
            </h3>
          </v-card-title>
          <v-container class="mx-auto">
            <v-row align="center" align-content="center">
              <v-col cols="12" sm="12" md="12">
                <v-img
                  aspect-ratio="2"
                  class="white--text align-end"
                  height="50%"
                  :src="itemSelected.image"
                >
                </v-img>
              </v-col>
            </v-row>
          </v-container>
          <v-card-text>
            <div style="color: black" v-html="itemSelected.description"></div>

            <v-alert
              v-if="itemSelected.files[0]"
              border="top"
              colored-border
              type="info"
              elevation="2"
            >
              Download files
              <a :href="itemSelected.files[0]" target="_blank" download>HERE</a>
            </v-alert>
          </v-card-text>
        </v-card>
      </v-dialog>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      dialogShow: false,
      itemSelected: {
        tittle: "",
        description: "<p></p>",
        category: "",
        image: "/images/default.jpeg",
        author: "",
        shortDesc: "",
        date: new Date().toISOString().substr(0, 10),
        files: [],
      }
    }
  },
  methods: {
    showItem(item) {
      this.itemSelected = Object.assign({}, item);
      this.dialogShow = true;
    },
  }
};
</script>

<style>
</style>
