import { ref, computed} from 'vue'

//读取token
const token =ref(
    localStorage.getItem('access_token') || ''
)

//当前登录用户
const currentUser = ref(null)

//登录状态
const isLoggedIn = computed(()=>{
    return Boolean(token.value)
})

//保存token
function setToken(value){
    token.value = value

    localStorage.setItem(
        'access_token',
        value
    )
}

//设置用户信息
function setUser(value) {
  currentUser.value = value
}

//清除登录状态
function clearAuth(){
    token.value = ''
    currentUser.value = ''

    localStorage.removeItem('access_token')
}

export function useAuth(){
    return{
        token,
        currentUser,
        isLoggedIn,
        setToken,
        setUser,
        clearAuth
    }
}

export {clearAuth}


