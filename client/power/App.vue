<template>
 <div class="container scroll" v-if="data !== null">
    <div class="first_child">
      <h1>Nu {{data.now}} KW</h1>
    </div>
    <div class="child horisontal_scroll">
      <Section interval="DAY" lookback=0 />
      <Section interval="DAY" lookback=1 />
    </div>
    <div class="child horisontal_scroll">
      <Section interval="MONTH" lookback=0 />
    </div>
    <div class="child">
      <Section interval="YEAR" lookback=0 />
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
      //setTimeout(this.update, 60000);
    }
  },
};
</script>
