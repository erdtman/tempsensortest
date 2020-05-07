<template>
  <div class="container">

  </div>
</template>

<script>
import axios from "axios";

export default {
  components: {
    Hour,
    HalfHour
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
