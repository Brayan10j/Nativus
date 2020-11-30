<template>
</template>

<script>
export default {
  middleware: "persistent",
  data() {
    return {
      alerta: false,
      absolute: true,
      opacity: 0.8,
      overlay : false,
      res: "",
      token: "",
      login: {
        email: "",
        password: "",
      },
      errord:{
        description: "",
      },
    };
  },
};
</script>

<style>

</style>
