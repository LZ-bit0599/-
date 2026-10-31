import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HelloWorld from './HelloWorld.vue'

describe('HelloWorld', () => {
  it('renders the msg prop', () => {
    const wrapper = mount(HelloWorld, { props: { msg: 'Vitest' } })
    expect(wrapper.text()).toContain('Vitest')
  })
})