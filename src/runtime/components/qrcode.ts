import type { QrCodeGenerateOptions } from 'uqr'

import type { PropType } from '#imports'
import { defineComponent, h, useQrcode, computed } from '#imports'

export default defineComponent({
  name: 'Qrcode',
  props: {
    value: {
      type: String,
      required: true,
    },
    options: {
      type: Object as PropType<QrCodeGenerateOptions>,
      default: () => ({}),
    },
  },
  setup(props) {
    const { data, size } = useQrcode(() => props.value, props.options)

    const svgPath = computed(() => {
      if (!data.value || !size.value) return ''

      let path = ''
      for (let y = 0; y < size.value; y++) {
        for (let x = 0; x < size.value; x++) {
          if (data.value[y][x]) {
            path += `M${x},${y}h1v1h-1z`
          }
        }
      }
      return path
    })

    return () => h('svg', {
      width: '100%',
      height: '100%',
      viewBox: `0 0 ${size.value} ${size.value}`,
      xmlns: 'http://www.w3.org/2000/svg',
      style: 'shape-rendering: crispEdges; display: block; max-width: 100%; max-height: 100%;',
    }, [
      h('path', {
        fill: 'currentColor',
        d: svgPath.value,
      }),
    ])
  },
})
