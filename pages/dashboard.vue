<template>
  <div>
    <div>
      <v-toolbar flat>
        <v-toolbar-title>CATEGORIES</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-btn
          @click="dialogCategory = true"
          small
          min-width="20px"
          width="20 px"
          class="ma-1"
        >
          <v-icon color="success" small> mdi-plus-circle-outline </v-icon>
        </v-btn>
        <v-btn
          @click="dialogDelete = true"
          small
          min-width="20px"
          width="20 px"
          class="ma-1"
        >
          <v-icon color="red" small> mdi-delete </v-icon>
        </v-btn>

        <v-dialog v-model="dialogCategory" max-width="300px">
          <v-card>
            <v-card-title class="text-lg-h6">
              <span class="headline text-lg-h6">Add Category</span>
            </v-card-title>
            <v-card-text>
              <v-text-field
                v-model="category"
                solo
                label="Name"
                clearable
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="dialogCategory = false">
                Cancel
              </v-btn>
              <v-btn color="blue darken-1" text @click="addCategory">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-lg-h6">
              <span class="headline text-lg-h6">Delete Category</span>
            </v-card-title>
            <v-card-text>
              <v-select
                v-model="categoryID"
                :items="$store.state.categories"
                item-text="name"
                item-value="_id"
                label="Solo field"
                solo
              ></v-select>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="dialogCategory = false">
                Cancel
              </v-btn>
              <v-btn color="blue darken-1" text @click="deleteCategory">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
      <v-list>
        <v-list-item-group
          v-for="(item, index) in $store.state.categories"
          :key="index + 1"
          multiple
        >
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>{{ item.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </div>
    <div>
      <!--
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
        <v-carousel-item>
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
        </v-carousel-item>
      </v-carousel>
    </v-card>
    --></div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  data: () => ({
    content: "",
    dialogCategory: false,
    dialogDelete: false,
    category: "",
    categoryID: "",
  }),
  methods: {
    ...mapMutations(["sendCategories"]),
    addCategory: async function () {
      await this.$apollo
        .mutate({
          mutation: require("../api/server/mutations/addCategory.gql"),
          variables: { data: { name: this.category } },
        })
        .then(async ({ data }) => {
          this.dialogCategory = false;
          this.sendCategories(data.addCategory);
        });
    },
    deleteCategory: async function () {
      await this.$apollo
        .mutate({
          mutation: require("../api/server/mutations/deleteCategory.gql"),
          variables: { _id: this.categoryID },
        })
        .then(async ({ data }) => {
          this.dialogDelete = false;
          this.sendCategories(data.deleteCategory);
        });
    },
  },
  apollo: {
    posts: {
      query: require("../api/server/queries/posts.gql"),
      fetchPolicy: "cache-and-network",
    },
  },
};
</script>
