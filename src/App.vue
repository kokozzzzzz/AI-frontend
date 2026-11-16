<script setup>
import UserSearch from './components/UserSearch.vue'
</script>

<template>
  <!-- <main class="container">
    <h1>用户管理系统</h1>

    <p>Vue3 + FastAPI</p>

    <UserSearch />
  </main> -->
  <RouterView />
</template>

<style scoped>
.container {
  max-width: 900px;
  margin: 60px auto;
  padding: 20px;
  text-align: center;
}
</style>