<template>
  <div
    class="child"
    v-on:click="click();"
    v-bind:class="{ active_child: active}">
      {{this.text}}
    </div>
</template>

<script>

export default {
  props: ["text", "active", "hour"],

  methods: {
    click() {
      this.$emit('click', this.hour);
    }
  },
};
</script>
