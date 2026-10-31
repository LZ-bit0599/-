import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import MyPagination from '../../src/components/MyPagination.vue'

function mountPagination(props = {}) {
  return mount(MyPagination, {
    props: {
      total: 100,
      page: 1,
      pageSize: 10,
      ...props,
    },
  })
}

describe('MyPagination 交互', () => {
  it('渲染分页组件并显示总数', () => {
    const wrapper = mountPagination()
    expect(wrapper.find('[data-testid="my-pagination"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('100')
  })

  it('点击“下一页”按钮触发 update:page 与 change 事件', async () => {
    const wrapper = mountPagination()
    await wrapper.find('.el-pagination').find('.btn-next').trigger('click')
    await nextTick()

    const updateEvents = wrapper.emitted('update:page')
    expect(updateEvents).toBeTruthy()
    expect(updateEvents?.at(-1)?.[0]).toBe(2)

    const changeEvents = wrapper.emitted('change')
    expect(changeEvents).toBeTruthy()
    expect(changeEvents?.at(-1)?.[0]).toEqual({ page: 2, pageSize: 10 })
  })

  it('点击“上一页”按钮触发上一页事件', async () => {
    const wrapper = mountPagination({ page: 3 })
    await wrapper.find('.el-pagination').find('.btn-prev').trigger('click')
    await nextTick()

    expect(wrapper.emitted('update:page')?.at(-1)?.[0]).toBe(2)
  })

  it('点击页码触发 update:page 事件', async () => {
    const wrapper = mountPagination()
    // el-pagination 的页码按钮，取第 5 页
    const numberButtons = wrapper.findAll('.el-pager .number')
    await numberButtons[4].trigger('click')
    await nextTick()

    expect(wrapper.emitted('update:page')?.at(-1)?.[0]).toBe(5)
  })

  it('切换 page-size 存在选择器', async () => {
    const wrapper = mountPagination()
    expect(wrapper.find('.el-select__wrapper').exists()).toBe(true)
  })

  it('在末页时"下一页"按钮不可用', async () => {
    // total 100 / pageSize 10 = 10 页，末页为 10
    const wrapper = mountPagination({ page: 10 })
    const nextBtn = wrapper.find('.el-pagination .btn-next')
    expect(nextBtn.attributes('disabled')).toBeDefined()
  })
})