
<script setup>
import { ref, onMounted } from 'vue'
import { getCurrentUser } from '../api/auth'
import { useAuth } from '../utils/auth'

const { setUser } = useAuth()

const profile = ref(null)
const loading = ref(false)
const error = ref('')

async function loadProfile() {
  loading.value = true
  error.value = ''

  try {
    // 请求GET /auth/me
    const response = await getCurrentUser()

    profile.value = response.data

    // 更新共享用户状态
    setUser(response.data)

  } catch (err) {
    error.value =
      err.response?.data?.detail ||
      '获取个人信息失败'

  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProfile()
})
</script>

<template>
  <div class="profile-page">

    <h1>个人中心</h1>

    <p v-if="loading">
      正在获取个人信息...
    </p>

    <p v-else-if="error" class="error">
      {{ error }}
    </p>

    <div v-else-if="profile" class="profile-card">

      <h2>当前登录用户</h2>

      <div
        v-for="(value, key) in profile"
        :key="key"
        class="profile-field"
      >
        <strong>{{ key }}：</strong>
        <span>{{ value }}</span>
      </div>

    </div>

  </div>
</template>

<style scoped>
.profile-page {
  max-width: 800px;
  margin: 40px auto;
}

.profile-card {
  padding: 25px;
  border: 1px solid #ddd;
  border-radius: 10px;
}

.profile-field {
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.error {
  color: red;
}
</style>
