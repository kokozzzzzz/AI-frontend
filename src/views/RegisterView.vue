<script setup>
import { reactive, ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { registerUser } from '../api/auth'

const router = useRouter()

const form = reactive({
  name: '', // 👈 改成 name，匹配后端
  password: '',
  confirmPassword: '',
  age: null // 👈 新增 age 字段
})

const loading = ref(false)
const error = ref('')

async function handleRegister() {
  error.value = ''

  if (!form.name.trim()) {
    error.value = '用户名不能为空'
    return
  }

  if (!form.age || form.age < 1) { // 👈 校验年龄
    error.value = '请输入合法的年龄'
    return
  }

  if (form.password.length < 6) {
    error.value = '密码至少需要6位'
    return
  }

  if (form.password !== form.confirmPassword) {
    error.value = '两次密码不一致'
    return
  }

  loading.value = true

  try {
    // 👈 发送 name 和 age
    await registerUser({
      name: form.name.trim(),
      password: form.password,
      age: form.age
    })

    alert('注册成功，请登录')
    await router.push('/login')

  } catch (err) {
    // 👈 优化错误展示：如果后端返回的是数组（422错误），提取第一条的 msg
    const detail = err.response?.data?.detail
    if (Array.isArray(detail)) {
      error.value = detail[0].msg + " (" + detail[0].loc.join('.') + ")"
    } else {
      error.value = detail || '注册失败'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="register-container">
    <h1>用户注册</h1>

    <form @submit.prevent="handleRegister">
      <input
        v-model="form.name"
        placeholder="用户名"
      />

      <input
        v-model="form.password"
        type="password"
        placeholder="密码"
      />

      <input
        v-model="form.confirmPassword"
        type="password"
        placeholder="确认密码"
      />

      <!-- 👈 新增年龄输入框 -->
      <input
        v-model.number="form.age"
        type="number"
        placeholder="年龄"
      />

      <p v-if="error" class="error">
        {{ error }}
      </p>

      <button :disabled="loading">
        {{ loading ? '注册中...' : '注册' }}
      </button>
    </form>

    <RouterLink to="/login">
      返回登录
    </RouterLink>
  </div>
</template>

<style scoped>
.register-container {
  width: 360px;
  margin: 100px auto;
  text-align: center;
}

input {
  box-sizing: border-box;
  display: block;
  width: 100%;
  margin: 15px 0;
  padding: 12px;
}

button {
  width: 100%;
  padding: 12px;
  cursor: pointer;
}

.error {
  color: red;
  font-size: 14px;
  text-align: left;
}
</style>