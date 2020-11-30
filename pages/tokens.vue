<template>
  <div>
    <form enctype="multipart/form-data">
      <v-file-input
        label="File input"
        outlined
        dense
        @change="onFileChange"
      ></v-file-input>
    </form>

    <v-data-table
      dense
      :headers="headers"
      :items="tokens"
      item-key="name"
      class="elevation-1"
      disable-pagination
      hide-default-footer
    ></v-data-table>
  </div>
</template>

<script>
export default {
  data: () => ({
    content: "",
    headers: [
      {
        text: "Code",
        align: "start",
        sortable: false,
        value: "code",
        class: "text-lg-subtitle-1"
      },
      { text: "Value", value: "value", class: "text-lg-subtitle-1" },
      { text: "Active", value: "active", class: "text-lg-subtitle-1" },
    ],
  }),
  apollo:{
    tokens: {
      query: require("../api/server/queries/tokens.gql"),
      fetchPolicy: "cache-and-network",
    }
  },
  methods: {
    onFileChange: async function (e) {
      console.log(e);
      const file = e;
      const reader = new FileReader();
      reader.onload = async (e) => {
        var csv = reader.result;
        var lines = csv.split("\n");
        var result = [];
        var headers = ["code", "value"];
        for (var i = 0; i < lines.length; i++) {
          var obj = {};
          var currentline = lines[i].split(",");
          for (var j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
          }
          result.push(obj);
        }
        var data = result.map(function (x) {
          x.active = false;
          x.value = parseInt(x.value);
          return x;
        });
        console.log(data);
        await this.$apollo
          .mutate({
            mutation: require("../api/server/mutations/tokens/addTokens.gql"),
            variables: { data: data },
          })
          .then(async (data) => {
            console.log(data);
            await this.$apollo.queries.tokens.refresh();

          });
      };
      reader.readAsText(file);
    },
  },
};
</script>
