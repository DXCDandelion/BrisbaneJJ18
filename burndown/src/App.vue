<template>
  <div id="app">
    <burndown></burndown>
  </div>
</template>

<script>
import Burndown from '@/components/Burndown.vue'
export default {
  name: 'app',
  components: {
    Burndown
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #3da79e;
  margin-top: 60px;
}
</style>
