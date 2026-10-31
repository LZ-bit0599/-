import { http, HttpResponse } from 'msw'

// 与 user store login() 写入的 token 保持一致
const VALID_TOKEN = 'mock-token'
const BEARER = `Bearer ${VALID_TOKEN}`

export const handlers = [
  // 受保护接口：校验 Authorization 头
  http.get('*/api/protected', ({ request }) => {
    const auth = request.headers.get('Authorization')

    if (auth !== BEARER) {
      return HttpResponse.json({ message: '未授权' }, { status: 401 })
    }

    return HttpResponse.json({ data: { ok: true, user: 'admin' } })
  }),
]