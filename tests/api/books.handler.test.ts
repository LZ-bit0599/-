import { beforeEach, describe, expect, it } from 'vitest'
import { resetBooks, type Book } from '../mocks/books'

const base = 'http://localhost'
const API = (path: string) => new URL(path, base).toString()
const headers = { 'Content-Type': 'application/json' }

async function json(res: Response) {
  return (await res.json()) as Record<string, unknown>
}

describe('MSW /api/books 接口', () => {
  beforeEach(() => {
    resetBooks()
  })

  describe('GET /api/books', () => {
    it('返回图书列表', async () => {
      const res = await fetch(API('/api/books'))
      expect(res.status).toBe(200)

      const body = await json(res)
      const data = body.data as Book[]
      expect(data).toHaveLength(2)
      expect(data[0]).toMatchObject({ id: 1, title: 'Vue 实战' })
    })
  })

  describe('GET /api/books/:id', () => {
    it('返回单本图书', async () => {
      const res = await fetch(API('/api/books/1'))
      expect(res.status).toBe(200)

      const body = await json(res)
      expect(body.data).toMatchObject({ id: 1, title: 'Vue 实战' })
    })

    it('图书不存在时返回 404', async () => {
      const res = await fetch(API('/api/books/999'))
      expect(res.status).toBe(404)
      expect(await json(res)).toMatchObject({ message: '图书不存在' })
    })
  })

  describe('POST /api/books', () => {
    it('新增图书成功，返回 201', async () => {
      const res = await fetch(API('/api/books'), {
        method: 'POST',
        headers,
        body: JSON.stringify({ title: '设计模式', author: '王五' }),
      })
      expect(res.status).toBe(201)

      const body = await json(res)
      expect(body.data).toMatchObject({ id: 3, title: '设计模式' })

      const list = await fetch(API('/api/books')).then((r) => r.json()) as { data: Book[] }
      expect(list.data).toHaveLength(3)
    })

    it('title/author 缺失时返回 400', async () => {
      const res = await fetch(API('/api/books'), {
        method: 'POST',
        headers,
        body: JSON.stringify({ title: '', author: '王五' }),
      })
      expect(res.status).toBe(400)
      expect(await json(res)).toMatchObject({ message: 'title 和 author 不能为空' })
    })

    it('书名重复时返回 409', async () => {
      const res = await fetch(API('/api/books'), {
        method: 'POST',
        headers,
        body: JSON.stringify({ title: 'Vue 实战', author: '张三' }),
      })
      expect(res.status).toBe(409)
      expect(await json(res)).toMatchObject({ message: '书名已存在' })
    })
  })

  describe('PUT /api/books/:id', () => {
    it('更新图书成功', async () => {
      const res = await fetch(API('/api/books/1'), {
        method: 'PUT',
        headers,
        body: JSON.stringify({ title: 'Vue 实战 3 版' }),
      })
      expect(res.status).toBe(200)

      const body = await json(res)
      expect(body.data).toMatchObject({ id: 1, title: 'Vue 实战 3 版' })
    })

    it('更新不存在的图书返回 404', async () => {
      const res = await fetch(API('/api/books/999'), {
        method: 'PUT',
        headers,
        body: JSON.stringify({ title: '任意' }),
      })
      expect(res.status).toBe(404)
      expect(await json(res)).toMatchObject({ message: '图书不存在' })
    })
  })

  describe('DELETE /api/books/:id', () => {
    it('删除图书成功，返回 204', async () => {
      const res = await fetch(API('/api/books/1'), { method: 'DELETE' })
      expect(res.status).toBe(204)

      const list = await fetch(API('/api/books')).then((r) => r.json()) as { data: Book[] }
      expect(list.data).toHaveLength(1)
    })

    it('删除不存在的图书返回 404', async () => {
      const res = await fetch(API('/api/books/999'), { method: 'DELETE' })
      expect(res.status).toBe(404)
      expect(await json(res)).toMatchObject({ message: '图书不存在' })
    })
  })
})