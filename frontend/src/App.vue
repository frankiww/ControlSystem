<!-- 2B2D42 -->
<!-- 8D99AE -->
<!-- EDF2F4 -->

<script setup>
import Navbar from './components/Navbar.vue';
</script>

<template>
  <div id="app">
    <Navbar v-if="$route.path !== '/login'" />
    <router-view />
  </div>
</template>

<style>
#app {
  font-family: Helvetica, Arial, Helvetica, sans-serif;
  color: #2B2D42;
  margin-top: 0;
}
body{
    background-color: #EDF2F4;
}
</style>
