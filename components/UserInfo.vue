<template>
  <v-col class="d-flex text-center">
    <v-card class="pt-6 mx-auto" flat max-width="400">
      <v-card-text>
        <v-avatar size="88">
          <v-img :src="item.photo" class="mb-6"></v-img>
        </v-avatar>
        <h3 class="headline mb-2">
          {{ item.name }}
        </h3>
        <div class="blue--text mb-2">
          {{ item.email }}
        </div>
        <div class="blue--text subheading font-weight-bold">
          {{ item.rol }}
        </div>
      </v-card-text>
      <v-divider></v-divider>
      <v-row class="text-left" tag="v-card-text">
        <v-col class="text-right mr-4 mb-2" tag="strong" cols="5">
          Pilgrim:
        </v-col>
        <v-col>{{ item.crypto }}</v-col>
        <v-col class="text-right mr-4 mb-2" tag="strong" cols="5">
          Pilgrim Generated:
        </v-col>
        <v-col>{{ item.cryptoGen }}</v-col>
        <v-col class="text-right mr-4 mb-2" tag="strong" cols="5">
          Link refer:
        </v-col>
        <v-col>
          <a
            :href="`https://platform.ahumpilgrim.org/singUp/?token=${item.codReferal}`"
            target="_blank"
            >{{ item.codReferal }}</a
          >
        </v-col>
      </v-row>
    </v-card>
  </v-col>
</template>

<script>
export default {
  props: {
    item: {},
  },
  data() {
    return {};
  },
};
</script>

<style>
</style>