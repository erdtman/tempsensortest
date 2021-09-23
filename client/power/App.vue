<template>
 <div class="container scroll" v-if="data !== null">
    <div class="first_child">
      <h1>Elförbrukning</h1>
      <div class="column col-12">
        <div class="columns">
          <div class="column col-6">
            <h5>Nu</h5>
          </div>
          <div class="column col-6">
            <h5>{{data.now}} KW</h5>
          </div>
        </div>
      </div>
    </div>
    <div class="child horisontal_scroll">
      <Section interval="DAY" lookback=0 color="GRADIENT"/>
      <Section interval="DAY" lookback=1 color="GRADIENT"/>
      <Section interval="DAY" lookback=2 color="GRADIENT"/>
      <Section interval="DAY" lookback=3 color="GRADIENT"/>
      <Section interval="DAY" lookback=4 color="GRADIENT"/>
      <Section interval="DAY" lookback=5 color="GRADIENT"/>
      <Section interval="DAY" lookback=6 color="GRADIENT"/>
    </div>
    <div class="child horisontal_scroll">
      <Section interval="MONTH" lookback=0 color="lightblue"/>
      <Section interval="MONTH" lookback=1 color="lightblue"/>
      <Section interval="MONTH" lookback=2 color="lightblue"/>
    </div>
    <div class="child">
      <Section interval="YEAR" lookback=0 color="lightblue"/>
      <Section interval="YEAR" lookback=1 color="lightblue"/>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Section from "./Section.vue";

export default {
  components: {
    Section
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
        const response = await axios.get("/power/stationsgatan/now");
        this.data = response.data;
      } catch (error) {
        console.log(`error: ${error.message}`);
      }
      setTimeout(this.update, 60000);
    }
  },
};
</script>
