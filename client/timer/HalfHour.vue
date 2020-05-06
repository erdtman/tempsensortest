<template>
  <div
    class="child half_hour"
    v-on:click="click();"
    v-bind:class="{ active_child: active}">
    </div>
</template>

<script>

export default {
  props: ["active", "hour"],

  methods: {
    click() {
      this.$emit('click', this.hour);
    }
  },
};
</script>
