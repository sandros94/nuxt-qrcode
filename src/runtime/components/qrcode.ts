import type { QrCodeGenerateOptions } from 'uqr'
import { QrCodeDataType } from 'uqr'
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
    pixelStyle: {
      type: String as PropType<'square' | 'rounded' | 'dot' | 'lowpoly'>,
      default: 'square',
    },
    markerStyle: {
      type: String as PropType<'square' | 'circle' | 'rounded' | 'lowpoly'>,
      default: 'square',
    },
    markerInnerStyle: {
      type: String as PropType<'square' | 'circle' | 'rounded' | 'lowpoly'>,
      default: 'square',
    },
  },
  setup(props) {
    const { data, size, types } = useQrcode(() => props.value, props.options)

    const svgElements = computed(() => {
      if (!data.value || !size.value || !types.value) return []

      const elements: any[] = []
      const markerPositions = [
        [1, 1],
        [size.value - 8, 1],
        [1, size.value - 8],
      ]

      for (let y = 0; y < size.value; y++) {
        for (let x = 0; x < size.value; x++) {
          if (data.value[y][x]) {
            const type = types.value[y][x]
            if (type === QrCodeDataType.Position) continue

            elements.push(createPixel(x, y, props.pixelStyle, data.value, size.value))
          }
        }
      }

      markerPositions.forEach(([x, y]) => {
        elements.push(...createMarker(x, y, props.markerStyle, props.markerInnerStyle))
      })

      return elements
    })

    return () => h('svg', {
      width: '100%',
      height: '100%',
      viewBox: `0 0 ${size.value} ${size.value}`,
      xmlns: 'http://www.w3.org/2000/svg',
      style: 'display: block; max-width: 100%; max-height: 100%;',
    }, svgElements.value)
  },
})

function createPixel(x: number, y: number, style: string, data: boolean[][], size: number) {
  switch (style) {
    case 'rounded':
      return createRoundedPixel(x, y, data, size)
    case 'lowpoly':
      return createLowpolyPixel(x, y, data, size)
    case 'dot':
      return h('circle', {
        cx: x + 0.5,
        cy: y + 0.5,
        r: 0.45, // Increased from 0.35 to make dots larger and almost touch
        fill: 'currentColor',
      })
    default: // square
      return h('rect', {
        x,
        y,
        width: 1,
        height: 1,
        fill: 'currentColor',
      })
  }
}

function createRoundedPixel(x: number, y: number, data: boolean[][], size: number) {
  const elements = []
  const pixelSize = 1
  const circleRadius = 0.485
  const squareSize = 0.5

  // Add base circle
  elements.push(h('circle', {
    cx: x + 0.5,
    cy: y + 0.5,
    r: circleRadius,
    fill: 'currentColor',
  }))

  // Check adjacent pixels and add squares accordingly
  if (y > 0 && data[y - 1][x]) {
    elements.push(h('rect', {
      x: x,
      y: y,
      width: pixelSize,
      height: squareSize,
      fill: 'currentColor',
    }))
  }
  if (x < size - 1 && data[y][x + 1]) {
    elements.push(h('rect', {
      x: x + 0.5,
      y: y,
      width: squareSize,
      height: pixelSize,
      fill: 'currentColor',
    }))
  }
  if (y < size - 1 && data[y + 1][x]) {
    elements.push(h('rect', {
      x: x,
      y: y + 0.5,
      width: pixelSize,
      height: squareSize,
      fill: 'currentColor',
    }))
  }
  if (x > 0 && data[y][x - 1]) {
    elements.push(h('rect', {
      x: x,
      y: y,
      width: squareSize,
      height: pixelSize,
      fill: 'currentColor',
    }))
  }

  return h('g', {}, elements)
}

function createLowpolyPixel(x: number, y: number, data: boolean[][], size: number) {
  const radius = 0.2 // white corner size
  const elements = []

  // Main square
  elements.push(h('rect', {
    x, y, width: 1, height: 1,
    fill: 'currentColor',
    style: 'shape-rendering: crispEdges;',
  }))

  // Check adjacent pixels and add corner covers if needed
  const top = y === 0 || !data[y - 1][x]
  const bottom = y === size - 1 || !data[y + 1][x]
  const left = x === 0 || !data[y][x - 1]
  const right = x === size - 1 || !data[y][x + 1]

  if (top && left) addCornerCover(x, y)
  if (top && right) addCornerCover(x + 1 - radius, y)
  if (bottom && left) addCornerCover(x, y + 1 - radius)
  if (bottom && right) addCornerCover(x + 1 - radius, y + 1 - radius)

  return h('g', {}, elements)

  function addCornerCover(cx: number, cy: number) {
    elements.push(h('rect', {
      x: cx, y: cy, width: radius, height: radius,
      fill: 'white',
      style: 'shape-rendering: crispEdges;',
    }))
  }
}

function createMarker(x: number, y: number, outerStyle: string, innerStyle: string) {
  const outer = createMarkerPart(x, y, 7, outerStyle)
  const middle = createMarkerPart(x + 1, y + 1, 5, innerStyle, 'white')
  const inner = createMarkerPart(x + 2, y + 2, 3, innerStyle, undefined, 0.14)

  return [outer, middle, inner]
}

function createMarkerPart(x: number, y: number, size: number, style: string, fill: string = 'currentColor', r: number = 0.07) {
  switch (style) {
    case 'circle':
      return h('circle', {
        cx: x + size / 2,
        cy: y + size / 2,
        r: size / 2,
        fill,
      })
    case 'rounded':
      return h('rect', {
        x,
        y,
        width: size,
        height: size,
        rx: size / 5,
        ry: size / 5,
        fill,
      })
    case 'lowpoly': {
      const radius = size * r // white corner size
      const elements = []

      // Main square
      elements.push(h('rect', {
        x, y, width: size, height: size,
        fill,
        style: 'shape-rendering: crispEdges;',
      }))

      // Add corner covers
      addCornerCover(x, y)
      addCornerCover(x + size - radius, y)
      addCornerCover(x, y + size - radius)
      addCornerCover(x + size - radius, y + size - radius)

      return h('g', {}, elements)

      function addCornerCover(cx: number, cy: number) {
        elements.push(h('rect', {
          x: cx, y: cy, width: radius, height: radius,
          fill: 'white',
          style: 'shape-rendering: crispEdges;',
        }))
      }
    }
    default: // square
      return h('rect', {
        x,
        y,
        width: size,
        height: size,
        fill,
      })
  }
}
