<script setup>
import {ref} from 'vue'
import { reactive } from 'vue'
import { getUserById } from '../api/users'

const userId = ref('') //用户ID
const user = ref(null)
const loading = ref(false)
const error = ref('')


async function searchUser(){
    error.value = ''
    user.value = null
    if(!userId.value.trim()){
        error.value = '请输入用户ID'
        return
    }

    loading.value = true
    error.value = ''
    user.value = null

    try {
        const response = await getUserById(userId.value.trim())

        user.value = response.data
    } catch (err) {
        error.value =
        err.response?.data?.detail ||
        err.message ||
        '用户查询失败'
    } finally {
        loading.value = false
    }
}

</script>


<template>
    <div class="user-search">
      <h2>用户查询</h2>
    <div class="search-box">
      <input
        v-model="userId"
        placeholder="请输入用户 ID"
        @keyup.enter="searchUser"
      />

      <button
        @click="searchUser"
        :disabled="loading"
      >
        {{ loading ? '查询中...' : '查询用户' }}
      </button>
    </div>

    <p v-if="loading">
      正在查询用户信息...
    </p>

    <p v-else-if="error" class="error">
      {{ error }}
    </p>

    <div v-else-if="user" class="result">
      <h3>查询结果</h3>

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
</template>


<style scoped>
.user-search {
  max-width: 500px;
  margin: 30px auto;
}

.search-box {
  display: flex;
  gap: 10px;
}

input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  background: #2563eb;
  color: white;
  cursor: pointer;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  color: #dc2626;
}

.result {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.user-field {
  padding: 8px 0;
}
</style>



