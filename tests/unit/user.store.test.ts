import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useUserStore } from '../../src/stores/user'

describe('useUserStore - 纯逻辑', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('初始状态', () => {
    it('默认未登录', () => {
      const store = useUserStore()
      expect(store.token).toBeNull()
      expect(store.userInfo).toBeNull()
      expect(store.isLoggedIn).toBe(false)
      expect(store.nickname).toBe('')
    })
  })

  describe('login', () => {
    it('凭证正确时登录成功', () => {
      const store = useUserStore()
      expect(store.login('admin', '123456')).toBe(true)
      expect(store.isLoggedIn).toBe(true)
      expect(store.userInfo?.username).toBe('admin')
      expect(store.token).toBeTruthy()
    })

    it('用户名为空时登录失败', () => {
      const store = useUserStore()
      expect(store.login('', '123456')).toBe(false)
      expect(store.isLoggedIn).toBe(false)
      expect(store.userInfo).toBeNull()
    })

    it('密码错误时登录失败', () => {
      const store = useUserStore()
      expect(store.login('admin', 'wrong')).toBe(false)
      expect(store.isLoggedIn).toBe(false)
      expect(store.token).toBeNull()
    })
  })

  describe('setToken / setUserInfo', () => {
    it('设置 token 后视为已登录', () => {
      const store = useUserStore()
      store.setToken('abc')
      expect(store.isLoggedIn).toBe(true)
    })

    it('设置 null token 后视为未登录', () => {
      const store = useUserStore()
      store.setToken('abc')
      store.setToken(null)
      expect(store.isLoggedIn).toBe(false)
    })

    it('设置用户信息后 nickname 计算属性生效', () => {
      const store = useUserStore()
      store.setUserInfo({
        id: 2,
        username: 'user',
        nickname: '小王',
        roles: ['user'],
      })
      expect(store.nickname).toBe('小王')
    })
  })

  describe('logout', () => {
    it('logout 后清空所有状态', () => {
      const store = useUserStore()
      store.login('admin', '123456')
      expect(store.isLoggedIn).toBe(true)

      store.logout()
      expect(store.token).toBeNull()
      expect(store.userInfo).toBeNull()
      expect(store.isLoggedIn).toBe(false)
      expect(store.nickname).toBe('')
    })
  })
})