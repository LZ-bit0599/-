import { http, HttpResponse } from 'msw'

export interface Book {
  id: number
  title: string
  author: string
}

// 内存数据源，接口测试期间由 resetBooks() 重置
let books: Book[] = [
  { id: 1, title: 'Vue 实战', author: '张三' },
  { id: 2, title: 'TypeScript 精通', author: '李四' },
]

export function resetBooks() {
  books = [
    { id: 1, title: 'Vue 实战', author: '张三' },
    { id: 2, title: 'TypeScript 精通', author: '李四' },
  ]
}

function findByTitle(title: string) {
  return books.find((b) => b.title === title)
}

export const handlers = [
  // 获取图书列表
  http.get('*/api/books', () => {
    return HttpResponse.json({ data: books })
  }),

  // 获取单本图书
  http.get('*/api/books/:id', ({ params }) => {
    const id = Number(params.id)
    const book = books.find((b) => b.id === id)
    if (!book) {
      return HttpResponse.json({ message: '图书不存在' }, { status: 404 })
    }
    return HttpResponse.json({ data: book })
  }),

  // 新增图书
  http.post('*/api/books', async ({ request }) => {
    const body = (await request.json()) as Partial<Book>
    if (!body.title || !body.author) {
      return HttpResponse.json({ message: 'title 和 author 不能为空' }, { status: 400 })
    }
    if (findByTitle(body.title)) {
      return HttpResponse.json({ message: '书名已存在' }, { status: 409 })
    }
    const id = books.length ? Math.max(...books.map((b) => b.id)) + 1 : 1
    const book: Book = { id, title: body.title, author: body.author! }
    books.push(book)
    return HttpResponse.json({ data: book }, { status: 201 })
  }),

  // 更新图书
  http.put('*/api/books/:id', async ({ params, request }) => {
    const id = Number(params.id)
    const index = books.findIndex((b) => b.id === id)
    if (index === -1) {
      return HttpResponse.json({ message: '图书不存在' }, { status: 404 })
    }
    const body = (await request.json()) as Partial<Book>
    books[index] = { ...books[index], ...body }
    return HttpResponse.json({ data: books[index] })
  }),

  // 删除图书
  http.delete('*/api/books/:id', ({ params }) => {
    const id = Number(params.id)
    const index = books.findIndex((b) => b.id === id)
    if (index === -1) {
      return HttpResponse.json({ message: '图书不存在' }, { status: 404 })
    }
    books.splice(index, 1)
    return new HttpResponse(null, { status: 204 })
  }),
]