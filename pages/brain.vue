<template>
  <div>
    <v-tabs v-model="model" centered>
      <v-tab
        v-for="(item, index) in items"
        :key="index + 1"
        :href="`#tab-${index + 1}`"
      >
        {{ item }}
      </v-tab>
    </v-tabs>
    <v-data-table
      dense
      :headers="header"
      :items="operations"
      item-key="name"
      class="elevation-1"
      v-if="model == 'tab-1'"
      disable-pagination
      hide-default-footer
    >
      <template v-slot:[`item.icon`]="{ item }">
        <v-row
          ><v-col>
            <v-img width="20px" :src="item.image.thumb"></v-img
            >{{ item.name }}</v-col
          ></v-row
        >
      </template>
      <template v-slot:[`item.operation`]="{ item }">
        <v-icon :color="getColorO(item.operation)">
        {{getIcon(item.operation)}}
        </v-icon>{{item.operation}}
      </template>
      <template v-slot:[`item.change`]="{ item }">
        <h3 :class="` ${getColor(item.change)}--text`">
        {{ item.change }} %
        </h3>
      </template>
    </v-data-table>

    <v-data-table
      dense
      :headers="headers"
      :items="coins"
      item-key="name"
      class="elevation-1"
      v-if="model == 'tab-2'"
      disable-pagination
      hide-default-footer
    >
      <template v-slot:[`item.icon`]="{ item }">
        <v-img width="20px" :src="item.image.thumb"></v-img>
      </template>
      <template v-slot:[`item.price`]="{ item }">
        {{ item.market_data.current_price.usd }}
      </template>
      <template v-slot:[`item.mktCap`]="{ item }">
        {{ item.market_data.market_cap.usd }}
      </template>
    </v-data-table>

    <iframe
      src="https://whale-alert.io/transaction-map-embed.shtml"
      height="700"
      width="100%"
      style="border: 0px #ffffff none"
      scrolling="no"
      frameborder="1"
      marginheight="0px"
      marginwidth="0px"
      v-if="model == 'tab-3'"
      allowfullscreen
    ></iframe>
  </div>
</template>

<script>
export default {
  data: () => ({
    model: null,
    items: ["Dark_alex_deep_scanning", "Coinmarketcal","Whale-Alert"],
    coins: [],
    array: [],
    headers: [
      { text: "Icon", value: "icon", class: "text-lg-subtitle-1" },
      {
        text: "Coin",
        align: "start",
        sortable: false,
        value: "name",
        class: "text-lg-subtitle-1",
      },
      { text: "Price", value: "price", class: "text-lg-subtitle-1" },
      { text: "Mkt Cap", value: "mktCap", class: "text-lg-subtitle-1" },
    ],
    header: [
      { text: "Operation", value: "operation", align: "start", class: "text-lg-subtitle-1" },
      { text: "TimeFrame", value: "frame", class: "text-lg-subtitle-1" },
      { text: "Price", value: "prices", class: "text-lg-subtitle-1" },
      { text: "Date", value: "date", class: "text-lg-subtitle-1" },
      { text: "Profit/Lost", value: "change", class: "text-lg-subtitle-1" },
    ],
    operations: [
      {
        operation: 'BUY',
        frame: '15m',
        prices: 2452.30,
        date: '2020-11-27 15:57:52',
        change: 2.34,
      },
      {
        operation: 'SELL',
        frame: '15m',
        prices: 7524.25,
        date: '2020-11-27 15:57:52',
        change: -1.15,
      },
      {
        operation: 'BUY',
        frame: '15m',
        prices: 2452.40,
        date: '2020-11-27 15:57:52',
        change: -1.28,
      },
      {
        operation: 'SELL',
        frame: '15m',
        prices: 685.50,
        date: '2020-11-27 15:57:52',
        change: 3.11,
      },
      {
        operation: 'BUY',
        frame: '15m',
        prices: 7546.65,
        date: '2020-11-26 15:57:52',
        change: 5.55,
      },
      {
        operation: 'SELL',
        frame: '15m',
        prices: 16348.70,
        date: '2020-11-26 15:57:52',
        change: 1.25,
      },
      {
        operation: 'SELL',
        frame: '15m',
        prices: 7486.25,
        date: '2020-11-26 15:57:52',
        change: -4.67,
      },
      {
        operation: 'SELL',
        frame: '15m',
        prices: 452.75,
        date: '2020-11-25 15:57:52',
        change: 5.58,
      },
      {
        operation: 'BUY',
        frame: '15m',
        prices: 11277.80,
        date: '2020-11-25 15:57:52',
        change: -3.48,
      },
      {
        operation: 'BUY',
        frame: '15m',
        prices: 4768.95,
        date: '2020-11-25 15:57:52',
        change: -2.34,
      },
    ]
  }),
  methods: {
      getIcon (operation) {
        if (operation == 'BUY') return 'mdi-arrow-up-thick'
        else if (operation == 'SELL') return 'mdi-arrow-down-thick'
        else return 'mdi-arrow-up'
      },
      getColorO(operation) {
        if (operation == 'BUY') return 'green'
        else if (operation == 'SELL') return 'red'
        else return 'orange'
      },
      getColor(change) {
        if (change > 0) return 'green'
        else if (change < 0) return 'red'
        else return 'orange'
      },
    },
  async created() {
    const CoinGecko = require("coingecko-api");
    const CoinGeckoClient = new CoinGecko();
    let data = await CoinGeckoClient.coins.all({ sparkline: true });
    console.log(data);
    this.coins = data.data;
    //https://api.whale-alert.io/v1/transactions?api_key=twqsCevn90npX4WXBPfINDHUQs6rTEQS&start=1606748896&cursor=448897dd-448869cf-5fc51242
  },
};
</script>

<style>
</style>
