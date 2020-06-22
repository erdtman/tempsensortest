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
            <HalfHour hour="00_5" v-bind:active="isActive('00_5')" v-on:click="toggle" />
            <Hour text="1" hour="01_0" v-bind:active="isActive('01_0')" v-on:click="toggle" />
            <HalfHour hour="01_5" v-bind:active="isActive('01_5')" v-on:click="toggle" />
            <Hour text="2" hour="02_0" v-bind:active="isActive('02_0')" v-on:click="toggle" />
            <HalfHour hour="02_5" v-bind:active="isActive('02_5')" v-on:click="toggle" />
            <Hour text="3" hour="03_0" v-bind:active="isActive('03_0')" v-on:click="toggle" />
            <HalfHour hour="03_5" v-bind:active="isActive('03_5')" v-on:click="toggle" />
            <Hour text="4" hour="04_0" v-bind:active="isActive('04_0')" v-on:click="toggle" />
            <HalfHour hour="04_5" v-bind:active="isActive('04_5')" v-on:click="toggle" />
            <Hour text="5" hour="05_0" v-bind:active="isActive('05_0')" v-on:click="toggle" />
            <HalfHour hour="05_5" v-bind:active="isActive('05_5')" v-on:click="toggle" />
            <Hour text="6" hour="06_0" v-bind:active="isActive('06_0')" v-on:click="toggle" />
            <HalfHour hour="06_5" v-bind:active="isActive('06_5')" v-on:click="toggle" />
            <Hour text="7" hour="07_0" v-bind:active="isActive('07_0')" v-on:click="toggle" />
            <HalfHour hour="07_5" v-bind:active="isActive('07_5')" v-on:click="toggle" />
            <Hour text="8" hour="08_0" v-bind:active="isActive('08_0')" v-on:click="toggle" />
            <HalfHour hour="08_5" v-bind:active="isActive('08_5')" v-on:click="toggle" />
            <Hour text="9" hour="09_0" v-bind:active="isActive('09_0')" v-on:click="toggle" />
            <HalfHour hour="09_5" v-bind:active="isActive('09_5')" v-on:click="toggle" />
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
            <Hour text="24" hour="00_0" v-bind:active="isActive('00_0')" v-on:click="toggle" />
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
