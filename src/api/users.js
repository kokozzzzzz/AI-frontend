import http from './http'

// 获取用户列表
export function getUsers() {
  return http.get('/users/')
}

// 根据 ID 获取用户
export function getUserById(userId) {
  return http.get(`/users/${userId}`)
}

// 创建用户
export function createUser(data) {
  return http.post('/users/', data)
}

// 更新用户
export function updateUser(userId, data) {
  return http.put(`/users/${userId}`, data)
}

// 删除用户
export function deleteUser(userId) {
  return http.delete(`/users/${userId}`)
}

