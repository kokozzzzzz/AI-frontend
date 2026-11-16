<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getCurrentUser } from '../api/auth'
import { useAuth } from '../utils/auth'

const router = useRouter()

const { currentUser, setUser, clearAuth } = useAuth()

const loading = ref(false)
const error = ref('')

async function loadUser() {
  loading.value = true
  error.value = ''

  try {
    const response = await getCurrentUser()

    currentUser.value = response.data
    setUser(response.data)

  } catch (err) {
    error.value =
      err.response?.data?.detail ||
      '获取用户信息失败'
  } finally {
    loading.value = false
  }
}

function handleLogout() {
  clearAuth()
  router.replace('/login')
}

onMounted(() => {
  loadUser()
})
</script>

<template>
  <div class="profile-container">
    <h1>个人中心</h1>

    <p v-if="loading">
      正在加载用户信息...
    </p>

    <p v-else-if="error" class="error">
      {{ error }}
    </p>

    <div v-else-if="currentUser">
      <h3>当前登录用户</h3>

      <div
        v-for="(value, key) in currentUser"
        :key="key"
      >
        <strong>{{ key }}：</strong>
        {{ value }}
      </div>
    </div>

    <button @click="handleLogout">
      退出登录
    </button>
  </div>
</template>

<style scoped>
.profile-container {
  max-width: 600px;
  margin: 80px auto;
  padding: 30px;
  border: 1px solid #ddd;
  border-radius: 10px;
}

.error {
  color: red;
}

button {
  margin-top: 30px;
  padding: 10px 20px;
  cursor: pointer;
}
</style>