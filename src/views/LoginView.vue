<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { loginUser } from '../api/auth'
import { useAuth } from '../utils/auth'

const router = useRouter()

const { setToken } = useAuth()

const username = ref('')
const password = ref('')

const loading = ref(false)
const error = ref('')

async function handleLogin() {
  error.value = ''

  if (!username.value.trim() || !password.value) {
    error.value = '请输入用户名和密码'
    return
  }

  loading.value = true

  try {
    const response = await loginUser(
      username.value.trim(),
      password.value
    )

    const data = response.data

    // 根据后端实际返回字段调整
    setToken(data.access_token)

    // 登录成功，跳转个人中心
    await router.replace('/profile')

  } catch (err) {
    error.value =
      err.response?.data?.detail ||
      '登录失败，用户名或密码错误'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <h1>用户登录</h1>

      <form @submit.prevent="handleLogin">
        <div class="form-item">
          <label>用户名</label>

          <input
            v-model="username"
            placeholder="请输入用户名"
          />
        </div>

        <div class="form-item">
          <label>密码</label>

          <input
            v-model="password"
            type="password"
            placeholder="请输入密码"
          />
        </div>

        <p v-if="error" class="error">
          {{ error }}
        </p>

        <button :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>

      <p>
        还没有账号？
        <RouterLink to="/register">
          立即注册
        </RouterLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f7fa;
}

.login-card {
  width: 360px;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.form-item {
  margin: 20px 0;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 8px;
}

input {
  box-sizing: border-box;
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

button {
  width: 100%;
  padding: 12px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.6;
}

.error {
  color: #dc2626;
}
</style>