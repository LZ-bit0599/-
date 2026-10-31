import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface UserInfo {
  id: number
  username: string
  nickname: string
  roles: string[]
}

// 演示用的本地凭证校验规则，实际项目里应替换为接口调用
const MOCK_ACCOUNT = 'admin'
const MOCK_PASSWORD = '123456'

export const useUserStore = defineStore('user', () => {
  const token = ref<string | null>(null)
  const userInfo = ref<UserInfo | null>(null)

  const isLoggedIn = computed(() => !!token.value)
  const nickname = computed(() => userInfo.value?.nickname ?? '')

  function login(username: string, password: string) {
    if (username !== MOCK_ACCOUNT || password !== MOCK_PASSWORD) {
      return false
    }
    token.value = 'mock-token'
    userInfo.value = {
      id: 1,
      username: MOCK_ACCOUNT,
      nickname: '管理员',
      roles: ['admin'],
    }
    return true
  }

  function setToken(value: string | null) {
    token.value = value
  }

  function setUserInfo(info: UserInfo | null) {
    userInfo.value = info
  }

  function logout() {
    token.value = null
    userInfo.value = null
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    nickname,
    login,
    setToken,
    setUserInfo,
    logout,
  }
})