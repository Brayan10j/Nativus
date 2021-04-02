<template>
  <div v-if="$store.state.userInfo.isAdmin">
    <v-data-table
      dense
      :headers="headers"
      :items="tokens"
      item-key="name"
      class="elevation-1"
      disable-pagination
      hide-default-footer
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title> TOKENS </v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>

          <v-btn
            icon
            elevation="3"
            color="secondary"
            class="mx-2"
            @click="dialogAdd = true"
          >
            <v-icon> mdi-plus </v-icon>
          </v-btn>
        </v-toolbar>
      </template>
    </v-data-table>

    <v-btn
      class="mx-2"
      fab
      dark
      color="indigo"
      fixed
      right
      bottom
      @click="exportExcel"
    >
      <v-icon dark> mdi-download </v-icon>
    </v-btn>
    <v-dialog v-model="dialogAdd">
      <v-card>
        <v-card-title>
          <span class="headline">Add Token</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="editedItem.code"
                  label="Code"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model.number="editedItem.value"
                  label="Value"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-select
                  v-model="editedItem.type"
                  :items="items"
                  label="Type"
                  solo
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogAdd = false">
            Cancel
          </v-btn>
          <v-btn color="blue darken-1" text @click="addToken"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import XLSX from "xlsx";

export default {
  data: () => ({
    content: "",
    items: ["Product","Credit"],
    editedItem: {
      code: "",
      active: false,
      value: 0,
      type: ""
    },
    dialogAdd: false,
    headers: [
      {
        text: "Code",
        align: "start",
        sortable: false,
        value: "code",
        class: "text-lg-subtitle-1",
      },
      { text: "Value", value: "value", class: "text-lg-subtitle-1" },
      { text: "Active", value: "active", class: "text-lg-subtitle-1" },
      { text: "Type", value: "type", class: "text-lg-subtitle-1" },
    ],
  }),
  apollo: {
    tokens: {
      query: require("../api/server/queries/tokens.gql"),
      fetchPolicy: "cache-and-network",
    },
  },
  methods: {
    exportExcel: function () {
      let exportData = this.tokens.map(function (t) {
        delete t._id;
        delete t.__typename;
        return t;
      });
      let data = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      const filename = "Tokens";
      XLSX.utils.book_append_sheet(workbook, data, filename);
      XLSX.writeFile(workbook, `${filename}.xlsx`);
    },
    async addToken() {
      try {
        await this.$apollo
        .mutate({
          mutation: require("../api/server/mutations/tokens/addToken.gql"),
          variables: { data: this.editedItem },
        })
        .then(async ({data}) => {
          this.editedItem.value = 0;
          this.editedItem.code = "";
          this.dialogAdd = false
          await this.$apollo.queries.tokens.refresh();
          this.$toast.success(data.addToken);
        });
      } catch (error) {
        this.$toast.error(error)
      }
      
    },
    onFileChange: async function (e) {
      console.log(e);
      const file = e;
      const reader = new FileReader();
      reader.onload = async (e) => {
        var csv = reader.result;
        var lines = csv.split("\n");
        var result = [];
        var headers = ["code", "value", "type"];
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
            mutation: require("../api/server/mutations/tokens/addToken.gql"),
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
