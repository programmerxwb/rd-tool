<template>
  <Home/>
  <router-view></router-view>
</template>

<script lang="ts" setup>
import Home from './components/Menu.vue'
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}

.value {
  color: #3ab54a;
}
</style>
