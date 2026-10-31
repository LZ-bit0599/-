import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useUserStore } from '../../src/stores/user'

const TOKEN_KEY = 'token'
const API = (path: string) => `http://localhost${path}`

describe('组合实验：登录 -> 存 token -> 访问受保护接口', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  function readStoredToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  }

  it('登录后写入 localStorage，携带 Authorization 访问 /api/protected 成功', async () => {
    const store = useUserStore()

    // 1. 登录：store 写入 token
    expect(store.login('admin', '123456')).toBe(true)
    expect(store.isLoggedIn).toBe(true)

    // 2. 存 token：持久化到 localStorage
    const token = store.token!
    localStorage.setItem(TOKEN_KEY, token)
    expect(readStoredToken()).toBe(token)

    // 3. 带 Authorization 访问受保护接口
    const res = await fetch(API('/api/protected'), {
      headers: { Authorization: `Bearer ${readStoredToken()}` },
    })

    expect(res.status).toBe(200)
    const body = (await res.json()) as { data: { ok: boolean; user: string } }
    expect(body.data).toEqual({ ok: true, user: 'admin' })
  })

  it('从 localStorage 读取 token 与 store 中一致（真实数据链路）', async () => {
    const store = useUserStore()
    store.login('admin', '123456')
    localStorage.setItem(TOKEN_KEY, store.token!)

    const storedToken = readStoredToken()
    expect(storedToken).toBe('mock-token')
    expect(storedToken).toBe(store.token)
  })

  it('无 token（未登录）访问 /api/protected 返回 401', async () => {
    // 未登录：localStorage 无 token，也不带 Authorization 头
    expect(readStoredToken()).toBeNull()

    const res = await fetch(API('/api/protected'))

    expect(res.status).toBe(401)
    const body = (await res.json()) as { message: string }
    expect(body.message).toBe('未授权')
  })
})