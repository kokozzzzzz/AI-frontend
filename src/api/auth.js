import http from './http'

export function registerUser(data) {
  return http.post('/auth/register', data)
}


export function loginUser(username, password) {
  const formData = new URLSearchParams()

  formData.append('username', username)
  formData.append('password', password)

  return http.post(
    '/auth/login',
    formData,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  )
}

export function getCurrentUser() {
  return http.get('/auth/me')
}




