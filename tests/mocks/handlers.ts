import { handlers as bookHandlers } from './books'
import { handlers as protectedHandlers } from './protected'

// 在此集中定义接口 mock，例如：
// http.get('/api/xxx', () => HttpResponse.json({}))

export const handlers = [...bookHandlers, ...protectedHandlers]