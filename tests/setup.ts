import { beforeEach, afterEach, beforeAll, afterAll } from 'vitest'
import { config, enableAutoUnmount } from '@vue/test-utils'
import ElementPlus from 'element-plus'
import { setupServer } from 'msw/node'
import { handlers } from './mocks/handlers'

config.global.plugins = [ElementPlus]
enableAutoUnmount(afterEach)

const server = setupServer(...handlers)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
  document.body.innerHTML = ''
})