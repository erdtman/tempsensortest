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
            <Hour text="12" hour="12_0" v-bind:active="isActive('12_0')" v-on:click="toggle" />
            <HalfHour hour="0_5" v-bind:active="isActive('0_5')" v-on:click="toggle" />
            <Hour text="1" hour="1_0" v-bind:active="isActive('1_0')" v-on:click="toggle" />
            <HalfHour hour="1_5" v-bind:active="isActive('1_5')" v-on:click="toggle" />
            <Hour text="2" hour="2_0" v-bind:active="isActive('2_0')" v-on:click="toggle" />
            <HalfHour hour="2_5" v-bind:active="isActive('2_5')" v-on:click="toggle" />
            <Hour text="3" hour="3_0" v-bind:active="isActive('3_0')" v-on:click="toggle" />
            <HalfHour hour="3_5" v-bind:active="isActive('3_5')" v-on:click="toggle" />
            <Hour text="4" hour="4_0" v-bind:active="isActive('4_0')" v-on:click="toggle" />
            <HalfHour hour="4_5" v-bind:active="isActive('4_5')" v-on:click="toggle" />
            <Hour text="5" hour="5_0" v-bind:active="isActive('5_0')" v-on:click="toggle" />
            <HalfHour hour="5_5" v-bind:active="isActive('5_5')" v-on:click="toggle" />
            <Hour text="6" hour="6_0" v-bind:active="isActive('6_0')" v-on:click="toggle" />
            <HalfHour hour="6_5" v-bind:active="isActive('6_5')" v-on:click="toggle" />
            <Hour text="7" hour="7_0" v-bind:active="isActive('7_0')" v-on:click="toggle" />
            <HalfHour hour="7_5" v-bind:active="isActive('7_5')" v-on:click="toggle" />
            <Hour text="8" hour="8_0" v-bind:active="isActive('8_0')" v-on:click="toggle" />
            <HalfHour hour="8_5" v-bind:active="isActive('8_5')" v-on:click="toggle" />
            <Hour text="9" hour="9_0" v-bind:active="isActive('9_0')" v-on:click="toggle" />
            <HalfHour hour="9_5" v-bind:active="isActive('9_5')" v-on:click="toggle" />
            <Hour text="10" hour="10_0" v-bind:active="isActive('10_0')" v-on:click="toggle" />
            <HalfHour hour="10_5" v-bind:active="isActive('10_5')" v-on:click="toggle" />
            <Hour text="11" hour="11_0" v-bind:active="isActive('11_0')" v-on:click="toggle" />
            <HalfHour hour="11_5" v-bind:active="isActive('11_5')" v-on:click="toggle" />
         </div>
      </div>
      <div class="columns">
         <h2>Kväll</h2>
      </div>
      <div class="columns">
         <div class="parent">
            <Hour text="24" hour="0_0" v-bind:active="isActive('0_0')" v-on:click="toggle" />
            <HalfHour hour="12_5" v-bind:active="isActive('12_5')" v-on:click="toggle" />
            <Hour text="13" hour="13_0" v-bind:active="isActive('13_0')" v-on:click="toggle" />
            <HalfHour hour="13_5" v-bind:active="isActive('13_5')" v-on:click="toggle" />
            <Hour text="14" hour="14_0" v-bind:active="isActive('14_0')" v-on:click="toggle" />
            <HalfHour hour="14_5" v-bind:active="isActive('14_5')" v-on:click="toggle" />
            <Hour text="15" hour="15_0" v-bind:active="isActive('15_0')" v-on:click="toggle" />
            <HalfHour hour="15_5" v-bind:active="isActive('15_5')" v-on:click="toggle" />
            <Hour text="16" hour="16_0" v-bind:active="isActive('16_0')" v-on:click="toggle" />
            <HalfHour hour="16_5" v-bind:active="isActive('16_5')" v-on:click="toggle" />
            <Hour text="17" hour="17_0" v-bind:active="isActive('17_0')" v-on:click="toggle" />
            <HalfHour hour="17_5" v-bind:active="isActive('17_5')" v-on:click="toggle" />
            <Hour text="18" hour="18_0" v-bind:active="isActive('18_0')" v-on:click="toggle" />
            <HalfHour hour="18_5" v-bind:active="isActive('18_5')" v-on:click="toggle" />
            <Hour text="19" hour="19_0" v-bind:active="isActive('19_0')" v-on:click="toggle" />
            <HalfHour hour="19_5" v-bind:active="isActive('19_5')" v-on:click="toggle" />
            <Hour text="20" hour="20_0" v-bind:active="isActive('20_0')" v-on:click="toggle" />
            <HalfHour hour="20_5" v-bind:active="isActive('20_5')" v-on:click="toggle" />
            <Hour text="21" hour="21_0" v-bind:active="isActive('21_0')" v-on:click="toggle" />
            <HalfHour hour="21_5" v-bind:active="isActive('21_5')" v-on:click="toggle" />
            <Hour text="22" hour="22_0" v-bind:active="isActive('22_0')" v-on:click="toggle" />
            <HalfHour hour="22_5" v-bind:active="isActive('22_5')" v-on:click="toggle" />
            <Hour text="23" hour="23_0" v-bind:active="isActive('23_0')" v-on:click="toggle" />
            <HalfHour hour="23_5" v-bind:active="isActive('23_5')" v-on:click="toggle" />
         </div>
      </div>
      <div class="columns">
        <div class="column col-4"></div>
        <div class="column col-4 training" v-on:click="toogelTraining()" v-bind:class="{ training_active: trainingActive()}">
          <img src="/public/images/training.png" alt="timer" class="img-rounded img-responsive training_image"/>
        </div>
        <div class="column col-4"></div>
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
        await axios.post("write", this.data, { headers: { 'Content-Type': 'application/json' } });
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
    trainingActive(state) {
      if(!this.data) {
          return false;
      }

      return this.data.training;
    },
    async toogelTraining() {
      try {
        if(!this.data) {
          return;
        }
        this.data.training = !this.data.training;
        await axios.post("write", this.data, { headers: { 'Content-Type': 'application/json' } });
      } catch (error) {
        console.log(error);
      }
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
        await axios.post("write", this.data, { headers: { 'Content-Type': 'application/json' } });
      } catch (error) {
        console.log(error);
      }
    },
    async update() {
      try {
        const response = await axios.get("read");
        this.data = response.data;
      } catch (error) {
        console.log(`error: ${error.message}`);
      }
      setTimeout(this.update, 60000);
    }
  },
};
</script>
