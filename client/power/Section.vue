<template>
  <div class="child" v-if="data !== null">
    <div class="column col-12">
      <h2 class="section_title">{{data.title}}</h2>
      <div class="columns">
        <div class="column col-6">
          <h5>Totalt:</h5>
        </div>
        <div class="column col-6">
          <h5>{{data.total}} KWh</h5>
        </div>
      </div>
      <div class="columns">
        <div class="column col-6">
          <h5>Peak:</h5>
        </div>
        <div class="column col-6">
          <h5>{{data.peak}} KW</h5>
        </div>
      </div>
      <chart :lookback="this.lookback" :interval="this.interval" :color="this.color" height="350px"></chart>
    </div>
  </div>
</template>


<script>
import Chart from "./Chart.vue";
import axios from "axios";

export default {
  components: {
    Chart
  },
  props: ["interval", "lookback", "color"],
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
        const response = await axios.get(`/power/stationsgatan/period?lookback=${this.lookback}&interval=${this.interval}`);
        this.data = response.data;
      } catch (error) {
        console.log(`error: ${error.message}`);
      }

      if (this.lookback !== '0') {
        return; // we only refresh the view for last DAY, MONTH or YEAR
      }
      setTimeout(this.update, 60000);
    }
  },
};
</script>
