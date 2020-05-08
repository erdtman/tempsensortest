<template>
  <div class="container scroll" v-if="data !== null">
    <div class="first_child">
      <h1>Nu {{data.now.measurement}} °C <span class="date">({{data.now.time}})</span></h1>
    </div>
    <div class="first_child">
      <h2>Senaste dygnet</h2>
      <h4>Min: {{data.day_min.measurement}} °C <span class="date">({{data.day_min.time}})</span></h4>
      <h4>Max: {{data.day_max.measurement}} °C <span class="date">({{data.day_max.time}})</span></h4>
      <chart :interval="'DAY'" height="300px"></chart>
    </div>
    <div class="child">
      <h2>Senaste veckan</h2>
      <h4>Min: {{data.week_min.measurement}} °C <span class="date">({{data.week_min.time}})</span></h4>
      <h4>Max: {{data.week_max.measurement}} °C <span class="date">({{data.week_max.time}})</span></h4>
      <chart :interval="'WEEK'" height="300px"></chart>
    </div>
    <div class="last_child">
      <h2>Senaste månaden</h2>
      <h4>Min: {{data.month_min.measurement}} °C <span class="date">({{data.month_min.time}})</span></h4>
      <h4>Max: {{data.month_max.measurement}} °C <span class="date">({{data.month_max.time}})</span></h4>
      <chart :interval="'MONTH'" height="300px"></chart>
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
        const response = await axios.get(`/measurement/outdoor/now?interval=${this.interval}`);
        this.data = response.data;
      } catch (error) {
        console.log(`error: ${error.message}`);
      }
      setTimeout(this.update, 60000);
    }
  },
};
</script>
