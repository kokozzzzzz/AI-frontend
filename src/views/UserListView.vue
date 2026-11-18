
<script setup>
import { ref, onMounted } from 'vue'
import { getUsers } from '../api/users'
import UserSearch  from '@/components/UserSearch.vue'

// 用户列表
const users = ref([])

// 加载状态
const loading = ref(false)

// 错误信息
const error = ref('')

// 获取用户列表
async function loadUsers() {
  loading.value = true
  error.value = ''

  try {
    const response = await getUsers()

    // 获取后端返回的数据
    const data = response.data

    // 根据实际返回格式解析
    if (Array.isArray(data)) {
      users.value = data
    } else if (Array.isArray(data.users)) {
      users.value = data.users
    } else {
      throw new Error('用户列表返回格式不正确')
    }

  } catch (err) {
    error.value =
      err.response?.data?.detail ||
      err.message ||
      '获取用户列表失败'

  } finally {
    loading.value = false
  }
}

// 页面加载时自动获取用户列表
onMounted(() => {
  loadUsers()
})
</script>

<template>
  <div class="user-page">

    <div class="header">
      <h1>用户管理</h1>

      <button
        @click="loadUsers"
        :disabled="loading"
      >
        {{ loading ? '加载中...' : '刷新列表' }}
      </button>
    </div>

    <!-- 用户ID查询 -->
    <UserSearch />

    <!-- 加载状态 -->
    <p v-if="loading">
      正在获取用户数据...
    </p>

    <!-- 错误状态 -->
    <p v-else-if="error" class="error">
      {{ error }}
    </p>

    <!-- 空数据状态 -->
    <p v-else-if="users.length === 0">
      暂无用户数据
    </p>

    <!-- 用户列表 -->
    <div v-else class="user-list">

      <div
        v-for="(user, index) in users"
        :key="user.id ?? index"
        class="user-card"
      >

        <div
          v-for="(value, key) in user"
          :key="key"
          class="user-field"
        >
          <strong>{{ key }}：</strong>
          <span>{{ value }}</span>
        </div>

      </div>

    </div>

  </div>
</template>

<style scoped>
.user-page {
  max-width: 900px;
  margin: 40px auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

button {
  padding: 10px 18px;
  border: none;
  border-radius: 6px;
  background: #2563eb;
  color: white;
  cursor: pointer;
}

button:disabled {
  opacity: 0.6;
}

.user-card {
  padding: 20px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
}

.user-field {
  padding: 6px 0;
}

.error {
  color: red;
}
</style>
