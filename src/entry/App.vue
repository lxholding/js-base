<template>
  <div id="app">
    <template v-if="keepAlive.enable">
      <keep-alive :exclude="keepAlive.exclude">
        <router-view></router-view>
      </keep-alive>
    </template>
    <template v-else>
      <router-view></router-view>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    keepAlive: {
      // keep-alive配置
      type: Object,
      default() {
        return {
          enable: false,
          exclude: '',
          include: ''
        };
      }
    }
  }
};
</script>
