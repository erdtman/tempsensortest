<template>
  <div class="container">
      <div class="columns">
        <div class="column col-4" v-on:click="stateChange('ON')" v-bind:class="{ active: activeState('ON'), inactive: !activeState('ON')}">
          <img src="/public/images/ON.png" alt="ON" class="img-rounded img-responsive state_image"/>
        </div>
        <div class="column col-4" v-on:click="stateChange('TIMER')" v-bind:class="{ active: activeState('TIMER'), inactive: !activeState('TIMER')}">
          <img src="/public/images/timer.png" alt="timer" class="img-rounded img-responsive state_image"/>
        </div>
        <div class="column col-4" v-on:click="stateChange('OFF')" v-bind:class="{ active: activeState('OFF'), inactive: !activeState('OFF')}">
          <img src="/public/images/OFF.png" alt="OFF" class="img-rounded img-responsive state_image"/>
        </div>
      </div>
      <div class="columns">
         <h2>Morgon</h2>
      </div>
      <div class="columns">
         <div class="parent">
            <Hour text="12" hour="12.0" v-bind:active="isActive('12.0')" v-on:click="toggle" />
            <HalfHour hour="0.5" v-bind:active="isActive('0.5')" v-on:click="toggle" />
            <Hour text="1" hour="1.0" v-bind:active="isActive('1.0')" v-on:click="toggle" />
            <HalfHour hour="1.5" v-bind:active="isActive('1.5')" v-on:click="toggle" />
            <Hour text="2" hour="2.0" v-bind:active="isActive('2.0')" v-on:click="toggle" />
            <HalfHour hour="2.5" v-bind:active="isActive('2.5')" v-on:click="toggle" />
            <Hour text="3" hour="3.0" v-bind:active="isActive('3.0')" v-on:click="toggle" />
            <HalfHour hour="3.5" v-bind:active="isActive('3.5')" v-on:click="toggle" />
            <Hour text="4" hour="4.0" v-bind:active="isActive('4.0')" v-on:click="toggle" />
            <HalfHour hour="4.5" v-bind:active="isActive('4.5')" v-on:click="toggle" />
            <Hour text="5" hour="5.0" v-bind:active="isActive('5.0')" v-on:click="toggle" />
            <HalfHour hour="5.5" v-bind:active="isActive('5.5')" v-on:click="toggle" />
            <Hour text="6" hour="6.0" v-bind:active="isActive('6.0')" v-on:click="toggle" />
            <HalfHour hour="6.5" v-bind:active="isActive('6.5')" v-on:click="toggle" />
            <Hour text="7" hour="7.0" v-bind:active="isActive('7.0')" v-on:click="toggle" />
            <HalfHour hour="7.5" v-bind:active="isActive('7.5')" v-on:click="toggle" />
            <Hour text="8" hour="8.0" v-bind:active="isActive('8.0')" v-on:click="toggle" />
            <HalfHour hour="8.5" v-bind:active="isActive('8.5')" v-on:click="toggle" />
            <Hour text="9" hour="9.0" v-bind:active="isActive('9.0')" v-on:click="toggle" />
            <HalfHour hour="9.5" v-bind:active="isActive('9.5')" v-on:click="toggle" />
            <Hour text="10" hour="10.0" v-bind:active="isActive('10.0')" v-on:click="toggle" />
            <HalfHour hour="10.5" v-bind:active="isActive('10.5')" v-on:click="toggle" />
            <Hour text="11" hour="11.0" v-bind:active="isActive('11.0')" v-on:click="toggle" />
            <HalfHour hour="11.5" v-bind:active="isActive('11.5')" v-on:click="toggle" />
         </div>
      </div>
      <div class="columns">
         <h2>Kväll</h2>
      </div>
      <div class="columns">
         <div class="parent">
            <Hour text="24" hour="0.0" v-bind:active="isActive('0.0')" v-on:click="toggle" />
            <HalfHour hour="12.5" v-bind:active="isActive('12.5')" v-on:click="toggle" />
            <Hour text="13" hour="13.0" v-bind:active="isActive('13.0')" v-on:click="toggle" />
            <HalfHour hour="13.5" v-bind:active="isActive('13.5')" v-on:click="toggle" />
            <Hour text="14" hour="14.0" v-bind:active="isActive('14.0')" v-on:click="toggle" />
            <HalfHour hour="14.5" v-bind:active="isActive('14.5')" v-on:click="toggle" />
            <Hour text="15" hour="15.0" v-bind:active="isActive('15.0')" v-on:click="toggle" />
            <HalfHour hour="15.5" v-bind:active="isActive('15.5')" v-on:click="toggle" />
            <Hour text="16" hour="16.0" v-bind:active="isActive('16.0')" v-on:click="toggle" />
            <HalfHour hour="16.5" v-bind:active="isActive('16.5')" v-on:click="toggle" />
            <Hour text="17" hour="17.0" v-bind:active="isActive('17.0')" v-on:click="toggle" />
            <HalfHour hour="17.5" v-bind:active="isActive('17.5')" v-on:click="toggle" />
            <Hour text="18" hour="18.0" v-bind:active="isActive('18.0')" v-on:click="toggle" />
            <HalfHour hour="18.5" v-bind:active="isActive('18.5')" v-on:click="toggle" />
            <Hour text="19" hour="19.0" v-bind:active="isActive('19.0')" v-on:click="toggle" />
            <HalfHour hour="19.5" v-bind:active="isActive('19.5')" v-on:click="toggle" />
            <Hour text="20" hour="20.0" v-bind:active="isActive('20.0')" v-on:click="toggle" />
            <HalfHour hour="20.5" v-bind:active="isActive('20.5')" v-on:click="toggle" />
            <Hour text="21" hour="21.0" v-bind:active="isActive('21.0')" v-on:click="toggle" />
            <HalfHour hour="21.5" v-bind:active="isActive('21.5')" v-on:click="toggle" />
            <Hour text="22" hour="22.0" v-bind:active="isActive('22.0')" v-on:click="toggle" />
            <HalfHour hour="22.5" v-bind:active="isActive('22.5')" v-on:click="toggle" />
            <Hour text="23" hour="23.0" v-bind:active="isActive('23.0')" v-on:click="toggle" />
            <HalfHour hour="23.5" v-bind:active="isActive('23.5')" v-on:click="toggle" />
         </div>
      </div>
   </div>
</template>

<script>
import axios from "axios";
import Hour from "./Hour.vue";
import HalfHour from "./HalfHour.vue";

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
    async toggle(index) {
      try {
        if(!this.data) {
          return;
        }
        if(this.data.state !== "TIMER") {
          return;
        }

        this.data.schedule[index] = !this.data.schedule[index];
        await axios.post("/timer/settings/save", this.data, { headers: { 'Content-Type': 'application/json' } });
      } catch (error) {
        console.log(error);
      }
    },
    activeState(state) {
      if(!this.data) {
          return false;
      }

      return state === this.data.state;
    },
    isActive(index) {
      if(!this.data) {
        return false;
      }
      if(this.data.state === "ON") {
        return true;
      }
      if(this.data.state === "OFF") {
        return false;
      }
      return this.data.schedule[index];
    },
    async stateChange(to){
      try {
        if(!this.data) {
          return false;
        }
        this.data.state = to;
        await axios.post("/timer/settings/save", this.data, { headers: { 'Content-Type': 'application/json' } });
      } catch (error) {
        console.log(error);
      }
    },
    async update() {
      try {
        const response = await axios.get("/timer/settings/read");
        this.data = response.data;
      } catch (error) {
        console.log(`error: ${error.message}`);
      }
      setTimeout(this.update, 60000);
    }
  },
};
</script>
