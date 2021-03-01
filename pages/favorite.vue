<template>
  <v-row>
    <v-col
      v-for="(item, index) in $store.state.userInfo.favorites == undefined
        ? []
        : $store.state.userInfo.favorites"
      :key="index"
    >
      <Post :item="item" />
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {

    };
  },
};
</script>

<style>
</style>
