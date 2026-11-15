import http from './http'

// 根据 ID 获取用户
export function getUserById(userId) {
  return http.get(`/users/${userId}`)
}