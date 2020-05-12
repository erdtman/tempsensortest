<template>
  <div class="child" v-if="data !== null">
    <div class="column col-12">
      <h2 class="section_title">{{data.title}}</h2>
      <h4>Totalt: {{data.total}} KWh</h4>
      <h4>Peak: {{data.peak}} KW</h4>
      <chart :lookback="this.lookback" :interval="this.interval" height="400px"></chart>
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
  props: ["interval", "lookback"],
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
      //setTimeout(this.update, 30000);
    }
  },
};
</script>
