
<script setup>
import { useRouter } from 'vue-router'
import { useAuth } from './utils/auth'

const router = useRouter()

const { isLoggedIn, clearAuth } = useAuth()

function logout() {
  clearAuth()
  router.replace('/login')
}
</script>

<template>
  <div class="app">

    <header v-if="isLoggedIn" class="navbar">

      <div class="logo">
        AI Learning System
      </div>

      <nav>
        <RouterLink to="/users">
          用户管理
        </RouterLink>

        <RouterLink to="/profile">
          个人中心
        </RouterLink>

        <button @click="logout">
          退出登录
        </button>
      </nav>

    </header>

    <main>
      <RouterView />
    </main>

  </div>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 40px;
  background: #1e293b;
  color: white;
}

.logo {
  font-size: 20px;
  font-weight: bold;
}

nav {
  display: flex;
  align-items: center;
  gap: 25px;
}

nav a {
  color: white;
  text-decoration: none;
}

nav a.router-link-active {
  color: #60a5fa;
}

button {
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

main {
  padding: 20px;
}
</style>
