<template>
  <div class="container scroll" v-if="data !== null">
    <div class="first_child">
      <h1>Temperatur</h1>
      <div class="column col-12">
        <div class="columns">
          <div class="column col-3">
            <h5>Nu</h5>
          </div>
          <div class="column col-3">
            <h5>{{data.now.measurement}} °C</h5>
          </div>
          <div class="column col-6">
            <span class="date">({{data.now.time}})</span>
          </div>
        </div>
      </div>
    </div>
    <div class="child">
      <div class="column col-12">
        <h2>Senaste dygnet</h2>
        <div class="columns">
          <div class="column col-3">
            <h5>Min:</h5>
          </div>
          <div class="column col-3">
            <h5>{{data.day_min.measurement}} °C</h5>
          </div>
          <div class="column col-6">
            <span class="date">({{data.day_min.time}})</span>
          </div>
        </div>
        <div class="columns">
          <div class="column col-3">
            <h5>Min:</h5>
          </div>
          <div class="column col-3">
            <h5>{{data.day_max.measurement}} °C</h5>
          </div>
          <div class="column col-6">
            <span class="date">({{data.day_max.time}})</span>
          </div>
        </div>
        <chart :interval="'DAY'" height="100px"></chart>
      </div>
    </div>
    <div class="child">
      <div class="column col-12">
        <h2>Senaste veckan</h2>
        <div class="columns">
          <div class="column col-3">
            <h5>Min:</h5>
          </div>
          <div class="column col-3">
            <h5>{{data.week_min.measurement}} °C</h5>
          </div>
          <div class="column col-6">
            <span class="date">({{data.week_min.time}})</span>
          </div>
        </div>
        <div class="columns">
          <div class="column col-3">
            <h5>Min:</h5>
          </div>
          <div class="column col-3">
            <h5>{{data.week_max.measurement}} °C</h5>
          </div>
          <div class="column col-6">
            <span class="date">({{data.week_max.time}})</span>
          </div>
        </div>
        <chart :interval="'WEEK'" height="100px"></chart>
      </div>
    </div>
    <div class="last_child">
      <div class="column col-12">
        <h2>Senaste månaden</h2>
        <div class="columns">
          <div class="column col-3">
            <h5>Min:</h5>
          </div>
          <div class="column col-3">
            <h5>{{data.month_min.measurement}} °C</h5>
          </div>
          <div class="column col-6">
            <span class="date">({{data.month_min.time}})</span>
          </div>
        </div>
        <div class="columns">
          <div class="column col-3">
            <h5>Min:</h5>
          </div>
          <div class="column col-3">
            <h5>{{data.month_max.measurement}} °C</h5>
          </div>
          <div class="column col-6">
            <span class="date">({{data.month_max.time}})</span>
          </div>
        </div>
        <chart :interval="'MONTH'" height="100px"></chart>
      </div>
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
