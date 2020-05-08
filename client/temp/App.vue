<template>
  <div class="container scroll">
    <div class="first_child">
      <h1>8.5 °C 22:16</h1>
    </div>
    <div class="child">
      <h1>Last 24 hours</h1>
      <chart :interval="'DAY'" height="450px"></chart>
    </div>
    <div class="child">
      <h1>Last 7 days</h1>
    </div>
    <div class="child">
      <h1>Last 30 days</h1>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Chart from "./Chart.vue";

export default {
  components: {
    Chart
  },
  data () {
    return {
      data: null,
    }
  },
  async mounted() {
    this.update();
  },
  methods: {
    async update() {
      try {
        //const response = await axios.get("/timer/settings/read");
        //this.data = response.data;
      } catch (error) {
        console.log(`error: ${error.message}`);
      }
      //setTimeout(this.update, 60000);
    }
  },
};
</script>
