<template>
  <v-row>
    <v-col cols="12" lg="3" v-for="(item, index) in posts" :key="index">
      <v-card
        height="350"
        class="mx-auto"
        width="300"
        @click.stop="dialogShow = true;"
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
  </v-row>
</template>

<script>
export default {};
</script>

<style>
</style>
