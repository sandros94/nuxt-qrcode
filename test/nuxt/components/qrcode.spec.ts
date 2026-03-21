import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Qrcode from '../../../src/runtime/components/qrcode'

describe('Qrcode component', () => {
  const testValue = 'https://github.com/sandros94/nuxt-qrcode'

  it('renders svg element', async () => {
    const wrapper = await mountSuspended(Qrcode, {
      props: { value: testValue },
    })
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('has correct xmlns attribute', async () => {
    const wrapper = await mountSuspended(Qrcode, {
      props: { value: testValue },
    })
    expect(wrapper.find('svg').attributes('xmlns')).toBe('http://www.w3.org/2000/svg')
  })

  it('has viewBox attribute', async () => {
    const wrapper = await mountSuspended(Qrcode, {
      props: { value: testValue },
    })
    const attrs = wrapper.find('svg').attributes()
    const viewBox = attrs.viewBox ?? attrs.viewbox
    expect(viewBox).toMatch(/^0 0 \d+ \d+$/)
  })

  it('renders background rect', async () => {
    const wrapper = await mountSuspended(Qrcode, {
      props: { value: testValue },
    })
    expect(wrapper.html()).toContain('fill="white"')
  })

  it('renders foreground elements', async () => {
    const wrapper = await mountSuspended(Qrcode, {
      props: { value: testValue },
    })
    expect(wrapper.html()).toContain('fill="black"')
  })

  it('applies custom width and height', async () => {
    const wrapper = await mountSuspended(Qrcode, {
      props: { value: testValue, width: 200, height: 200 },
    })
    expect(wrapper.find('svg').attributes('width')).toBe('200')
    expect(wrapper.find('svg').attributes('height')).toBe('200')
  })

  it('applies custom colors', async () => {
    const wrapper = await mountSuspended(Qrcode, {
      props: { value: testValue, whiteColor: 'transparent', blackColor: '#FF00FF' },
    })
    expect(wrapper.html()).toContain('fill="transparent"')
    expect(wrapper.html()).toContain('fill="#FF00FF"')
  })

  it('applies variant prop', async () => {
    const wrapperDefault = await mountSuspended(Qrcode, {
      props: { value: testValue },
    })
    const wrapperDots = await mountSuspended(Qrcode, {
      props: { value: testValue, variant: 'dots' },
    })
    expect(wrapperDefault.html()).not.toBe(wrapperDots.html())
  })

  it('applies invert prop', async () => {
    const wrapper = await mountSuspended(Qrcode, {
      props: { value: testValue, invert: true },
    })
    const html = wrapper.html()
    expect(html).toContain('fill="black"')
    expect(html).toContain('fill="white"')
  })

  it('updates when value changes', async () => {
    const wrapper = await mountSuspended(Qrcode, {
      props: { value: 'hello' },
    })
    const html1 = wrapper.html()

    await wrapper.setProps({ value: 'world' })
    const html2 = wrapper.html()

    expect(html1).not.toBe(html2)
  })

  it('passes through additional attrs', async () => {
    const wrapper = await mountSuspended(Qrcode, {
      props: { value: testValue },
      attrs: { class: 'my-qrcode', id: 'test-qr' },
    })
    expect(wrapper.find('svg').attributes('class')).toContain('my-qrcode')
    expect(wrapper.find('svg').attributes('id')).toBe('test-qr')
  })

  it('emits encoded event', async () => {
    const wrapper = await mountSuspended(Qrcode, {
      props: { value: testValue },
    })
    expect(wrapper.emitted('encoded')).toBeTruthy()
    const emittedData = wrapper.emitted('encoded')![0]![0] as any
    expect(emittedData).toHaveProperty('size')
    expect(emittedData).toHaveProperty('data')
  })

  it('renders with preserveAspectRatio', async () => {
    const wrapper = await mountSuspended(Qrcode, {
      props: { value: testValue, preserveAspectRatio: 'xMidYMid meet' },
    })
    const attrs = wrapper.find('svg').attributes()
    const par = attrs.preserveAspectRatio ?? attrs.preserveaspectratio
    expect(par).toBe('xMidYMid meet')
  })

  describe('variant rendering', () => {
    const variants = ['default', 'dots', 'rounded', 'pixelated', 'circle'] as const

    for (const variant of variants) {
      it(`renders with variant "${variant}"`, async () => {
        const wrapper = await mountSuspended(Qrcode, {
          props: { value: testValue, variant },
        })
        expect(wrapper.find('svg').exists()).toBe(true)
        expect(wrapper.html()).toMatchSnapshot()
      })
    }
  })
})
