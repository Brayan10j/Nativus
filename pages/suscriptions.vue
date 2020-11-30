<template>
  <v-row class="mx-0" width="850">
    <v-col v-for="(item, index) in licenses" :key="index" class="text-center" style="max-width: 350px;">
      <v-card
        class="carta mx-auto rounded-xl"
        elevation="16"
        width="280"
        height="420"
      >
        <v-card-title class="justify-center my-5"
          ><h1>{{ item.name }}</h1></v-card-title
        >
        <v-card-text class="py-0"
          ><div class="before">$ {{ item.price }}</div>
          <div class="price"><span>$</span>{{ item.price }}</div></v-card-text
        >
        <v-card-text class="plan">{{ item.duration }}</v-card-text>
        <v-list dense height="100" color="rgba(0, 0, 0, 0)">
          <v-list-item-group>
            <v-list-item
              class="d-inline-flex"
              v-for="(item, i) in item.permission"
              :key="i"
            >
              <v-chip class="details elevation-10" text-color="white">
                <v-avatar left>
                  <v-icon>mdi-checkbox-marked-circle</v-icon>
                </v-avatar>
                <v-list-item-title v-text="item"></v-list-item-title
              ></v-chip>
            </v-list-item>
          </v-list-item-group>
        </v-list>        
        <v-card-actions>          
          <v-btn            
            class="buy-button rounded-br-xl"
            color="info"
            elevation="9"
            @click="buyLicense(item)"
            ><h3>Activate</h3></v-btn
          >     

        </v-card-actions>
        <v-alert
          :class="$store.state.userInfo.licenses.includes(item.name)? 'buy-butto':''"
          :value="alert"
          class="mb-0"
          height="62" 
          color="green darken-3"
          type="success"
            style="visibility: hidden;"
        >Product already owned</v-alert>
      </v-card>
      <v-overlay :absolute="absolute" :value="alerta" :opacity="opacity">
        <v-alert
          :value="alerta"
          color="red darken-2"
          type="error"
          border="top"
          transition="scale-transition"
          >{{errord.description}}
          <v-btn
            color="white"
            elevation="3"
            class="ml-3"
            right
            icon
            small
            @click="alerta = !alerta"
            ><v-icon dark> mdi-close </v-icon></v-btn
          ></v-alert
        >
      </v-overlay>
    </v-col>
  </v-row>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  data() {
    return {      
      alert: true,
      alerta: false,
      absolute: true,
      opacity: 0.8,
      transaction: {
        user: "",
        description: "License purchase",
        credits: "",
        date: new Date().toISOString().substr(0, 10),
      },
      errord:{
        description: "error"
      }
    };
  },
  apollo: {
    licenses: {
      query: require("../api/server/queries/licenses.gql"),
      fetchPolicy: "cache-and-network",
      //pollInterval: 7000, //puede cambiarse esto a una subscriptionMore
    },
  },
  computed: {
    filterLicences: function () {
      if (this.licenses == undefined) {
        return [];
      } else {
        var lic = this.$store.state.userInfo.licenses;
        return this.licenses.filter(function (item) {
          return lic.includes(item.name) ? false : true;
        });
      }
    },
  },
  methods: {
    ...mapMutations(["sendUserInfo", "sendBalance"]),
    async buyLicense(license) {
        try {
          await this.$apollo
            .mutate({
              mutation: require("../api/server/mutations/buyLicense.gql"),
              variables: {
                _idUser: this.$store.state.userInfo._id,
                _idLicense: license._id,
              },
            })
            .then(async ({ data }) => {
              console.log(data);
              this.sendUserInfo(data.buyLicense);
            });
          this.$router.push("/insinght");
        } catch (error) {
          //alert(error);
          this.errord.description="Insufficient balance";
          this.alerta=true;
        }
    },
  },
};
</script>
<style>
.carta:nth-child(1) {
  background: #7f7fd5;
  background: linear-gradient(to left, #91eae4, #86a8e7, #7f7fd5);
}

.col .carta .details {
  background-color: #3949ab;
}

.col:nth-child(2) .carta {
  background: #ff416c;
  background: linear-gradient(to right, #ff4b2b, #ff416c);
}

.col:nth-child(2) .carta .details {
  background-color: #e53935;
}

.col:nth-child(3) .carta {
  background: #00b09b;
  background: linear-gradient(to right, #96c93d, #00b09b);
}

.col:nth-child(3) .carta .details {
  background-color: #43a047;
}

.col:nth-child(4) .carta {
  background: #d6ff41;
  background: linear-gradient(to right, #f1ff2b, #61ff41);
}

.col:nth-child(4) .carta .details {
  background-color: #ffb300;
}

.col:nth-child(5) .carta {
  background: #3e00b0;
  background: linear-gradient(to right, #523dc9, #5200b0);
}

.col:nth-child(5) .carta .details {
  background-color: #3949ab;
}

.col .carta .price {
  color: azure;
  font-weight: bold;
  font-size: 4rem;
  position: relative;
  margin: 10px 0px 20px;
  z-index: 2;
}
.col .carta .price span {
  font-size: 1.8rem;
  position: absolute;
  left: 8%;
  top: 65%;
}

.col .carta .before {
  font-weight: bold;
  color: rgba(255, 255, 255, 0.1);
  margin-left: -7%;
  margin-right: -5%;
  margin-bottom: -10%;
  font-size: 4.5rem;
  z-index: -1;
  text-shadow: 0 0 0px rgba(0, 0, 0, 0);
  transition: all 1s ease-in-out;
}

.col .carta .plan {
  font-weight: bold;
  text-transform: uppercase;
  font-size: 1.3rem;
  position: relative;
}
.col .carta .plan:before,
.col .carta .plan:after {
  position: absolute;
  content: "";
  width: 35px;
  height: 2px;
  background: rgba(255, 255, 255, 0.7);
  bottom: 40%;
  transition: all 0.2s ease-out;
}

.col .carta .plan:before {
  top: 50%;
  right: 70%;
  transform: translate(-50%, -50%);
}
.col .carta .plan:after {
  top: 50%;
  right: 10%;
  transform: translate(-0%, -50%);
}
.col .carta .buy-butto {
  visibility: visible !important;
  position: absolute;
  width: 100%;
  right: 0%;
  bottom: 0%;
}
.col .carta .buy-button {
  color: azure;
  font-weight: bold;
  cursor: pointer;
  position: absolute;
  width: 150px;
  height: 60px;
  border-top-left-radius: 1.5rem;
  border-bottom-left-radius: 0rem;
  border-top-right-radius: 0%;
  right: 0%;
  bottom: 0%;
  transition: all 0.4s ease-in-out;
}
.col .carta .buy-button h3 {
  text-shadow: 0 0 0;
  text-decoration: none;
  left: 8%;
  top: 10%;
  color: azure;
  font-size: 1.2rem;
  transition: all 0.4s ease-in-out;
}

.col .carta:hover {
  transform: scale(1.05);
}

.col .carta:hover .before {
  animation: text-hover 1s ease-in-out infinite normal;
}

.col .carta:hover .plan:before {
  right: 80%;
}
.col .carta:hover .plan:after {
  right: 0%;
}

.col .carta:hover .buy-button h {
  left: 50%;
  transform: translate(-50%, 0%);
}

.col .carta:hover .buy-button {
  width: 100%;
  right: 0%;
  border-radius: 0%;
  border-bottom-left-radius: 1.5rem;
}

/*
*/
</style>
