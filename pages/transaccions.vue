<template>
  <v-card>
    <v-card-title>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      dense
      :headers="headers"
      :items="transactions"
      item-key="name"
      class="elevation-1 text-lg-h6"
      disable-pagination
      hide-default-footer
      sort-desc
      :search="search"
    >
      <template v-slot:[`item.credits`]="{ item }">
        <v-chip :color="getColor(item.description)" dark>
          {{ item.credits }}
        </v-chip>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    search: "",
    desserts: [],
    headers: [
      {
        text: "ID (user)",
        align: "start",
        sortable: false,
        value: "user",
        class: "text-lg-subtitle-1",
      },
      {
        text: "Description",
        value: "description",
        class: "text-lg-subtitle-1",
      },
      { text: "Credits", value: "credits", class: "text-lg-subtitle-1" },
      { text: "Date", value: "date", class: "text-lg-subtitle-1" },
    ],
  }),
  methods: {
    getColor(description) {
      if (description == "License purchase") return "red";
      else if (description == "") return "orange";
      else return "green";
    },
  },
  apollo: {
    transactions: {
      query: require("../api/server/queries/transactions.gql"),
      fetchPolicy: "cache-and-network",
    },
  },
};
</script>
