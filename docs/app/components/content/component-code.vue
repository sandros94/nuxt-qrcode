<!-- eslint-disable no-useless-escape -->
<script setup lang="ts">
import json5 from 'json5'
import { kebabCase, pascalCase } from 'scule'
import { hash } from 'ohash'
import { get, set } from '#ui/utils'

const props = defineProps<{
  /** Override the slug taken from the route */
  slug?: string
  class?: any
  /** List of props to ignore in selection */
  ignore?: string[]
  /** List of props to hide from code and selection */
  hide?: string[]
  /** List of props to externalize in script setup */
  external?: string[]
  /** List of props to use with `v-model` */
  model?: string[]
  /** List of items for each prop */
  items?: { [key: string]: string[] }
  props?: { [key: string]: any }
  slots?: { [key: string]: any }
  /**
   * Whether to collapse the code block
   * @defaultValue false
   */
  collapse?: boolean
  /**
   * A list of line numbers to highlight in the code block
   */
  highlights?: number[]
}>()

const route = useRoute()

const name = props.slug ?? route.params.slug?.[route.params.slug.length - 1] ?? ''
const componentName = pascalCase(name)
const component = defineAsyncComponent(() => import(`#qrcode/components/${kebabCase(name)}.ts`))

const componentProps = reactive({ ...(props.props || {}) })
const componentEvents = reactive({
  ...Object.fromEntries((props.model || []).map(key => [`onUpdate:${key}`, (e: any) => setComponentProp(key, e)])),
  ...(componentProps.modelValue ? { [`onUpdate:modelValue`]: (e: any) => setComponentProp('modelValue', e) } : {}),
})

function getComponentProp(name: string) {
  return get(componentProps, name) ?? undefined
}

function setComponentProp(name: string, value: any) {
  set(componentProps, name, value)
}

const meta = await fetchComponentMeta(componentName)

function mapKeys(obj: object, parentKey = ''): any {
  return Object.entries(obj || {}).flatMap(([key, value]: [string, any]) => {
    if (typeof value === 'object' && !Array.isArray(value)) {
      return mapKeys(value, key)
    }

    const fullKey = parentKey ? `${parentKey}.${key}` : key

    return !props.ignore?.includes(fullKey) && !props.hide?.includes(fullKey) ? fullKey : undefined
  }).filter(Boolean)
}

const options = computed(() => {
  const keys = mapKeys(props.props || {})

  return keys.map((key: string) => {
    const prop = meta?.meta?.props?.find((prop: any) => prop.name === key)
    const propItems = get(props.items, key, [])
    const items = propItems.length
      ? propItems.map((item: any) => ({
          value: item,
          label: item,
        }))
      : []

    return {
      name: key,
      label: key,
      type: prop?.type,
      items,
    }
  })
})

const code = computed(() => {
  let code = ''

  if (props.collapse) {
    code += `::code-collapse
`
  }

  code += `\`\`\`vue${props.highlights?.length ? ` {${props.highlights.join('-')}}` : ''}`

  if (props.external?.length) {
    code += `
<script setup lang="ts">
`
    for (const key of props.external) {
      code += `const ${key === 'modelValue' ? 'value' : key} = ref(${json5.stringify(componentProps[key], null, 2).replace(/,([ |\t\n]+[}|\]])/g, '$1')})
`
    }
    code += `<\/script>
`
  }

  code += `
<template>
  <${componentName}`
  for (const [key, value] of Object.entries(componentProps)) {
    if (key === 'modelValue') {
      code += ` v-model="value"`
      continue
    }

    if (props.model?.includes(key)) {
      code += ` v-model:${key}="${key}"`
      continue
    }

    if (value === undefined || value === null || value === '' || props.hide?.includes(key)) {
      continue
    }

    const prop = meta?.meta?.props?.find((prop: any) => prop.name === key)
    const keyName = kebabCase(key)

    if (typeof value === 'boolean') {
      if (value && prop?.default === 'true') {
        continue
      }
      if (!value && (!prop?.default || prop.default === 'false')) {
        continue
      }

      code += value ? ` ${keyName}` : ` :${key}="false"`
    }
    else if (typeof value === 'object') {
      const parsedValue = !props.external?.includes(key) ? json5.stringify(value, null, 2).replace(/,([ |\t\n]+[}|\])])/g, '$1') : key

      code += ` :${keyName}="${parsedValue}"`
    }
    else {
      const propDefault = prop && (prop.default ?? prop.tags?.find((tag: any) => tag.name === 'defaultValue')?.text)
      if (propDefault === value) {
        continue
      }

      code += ` ${typeof value === 'number' ? ':' : ''}${keyName}="${value}"`
    }
  }

  if (props.slots) {
    code += `>`
    for (const [key, value] of Object.entries(props.slots)) {
      if (key === 'default') {
        code += props.slots.default
      }
      else {
        code += `
  <template #${key}>
    ${value}
  </template>`
      }
    }
    code += (Object.keys(props.slots).length > 1 ? '\n' : '') + `</${componentName}>`
  }
  else {
    code += ` />`
  }
  code += `\n</template>
\`\`\`
`

  if (props.collapse) {
    code += `
::`
  }

  return code
})

const { data: ast } = await useAsyncData(
  `component-code-${componentName}-${hash({ props: componentProps, slots: props.slots })}`,
  async () => parseMarkdown(code.value),
  { watch: [code] },
)
</script>

<template>
  <div class="my-5">
    <div>
      <div v-if="options.length" class="flex items-center gap-2.5 border border-[var(--ui-border-muted)] border-b-0 relative rounded-t-[calc(var(--ui-radius)*1.5)] px-4 py-2.5 overflow-x-auto">
        <template v-for="option in options" :key="option.name">
          <UFormField
            :label="option.label"
            size="sm"
            class="inline-flex ring ring-[var(--ui-border-accented)] rounded-[var(--ui-radius)]"
            :ui="{
              wrapper: 'bg-[var(--ui-bg-elevated)]/50 rounded-l-[var(--ui-radius)] flex border-r border-[var(--ui-border-accented)]',
              label: 'text-[var(--ui-text-muted)] px-2 py-1.5',
              container: 'mt-0',
            }"
          >
            <USelectMenu
              v-if="option.items?.length"
              :model-value="getComponentProp(option.name)"
              :items="option.items"
              value-key="value"
              color="neutral"
              variant="soft"
              class="rounded-[var(--ui-radius)] rounded-l-none min-w-12"
              :search-input="false"
              :class="[option.name.toLowerCase().endsWith('color') && 'pl-6']"
              :ui="{ itemLeadingChip: 'size-2' }"
              @update:model-value="setComponentProp(option.name, $event)"
            >
              <template v-if="option.name.toLowerCase().endsWith('color')" #leading="{ modelValue, ui }">
                <UChip
                  v-if="modelValue"
                  inset
                  standalone
                  :color="(modelValue as any)"
                  :size="ui.itemLeadingChipSize() as any"
                  class="size-2"
                />
              </template>
            </USelectMenu>
            <UInput
              v-else
              :type="option.type?.includes('number') && !option.type?.includes('number[]') ? 'number' : 'text'"
              :model-value="getComponentProp(option.name)"
              color="neutral"
              variant="soft"
              :ui="{ base: 'rounded-[var(--ui-radius)] rounded-l-none min-w-12' }"
              @update:model-value="setComponentProp(option.name, $event)"
            />
          </UFormField>
        </template>
      </div>

      <div v-if="component" class="flex justify-center border border-b-0 border-[var(--ui-border-muted)] relative p-4 z-[1]" :class="[!options.length && 'rounded-t-[calc(var(--ui-radius)*1.5)]', props.class]">
        <component :is="component" v-bind="{ ...componentProps, ...componentEvents }">
          <template v-for="slot in Object.keys(slots || {})" :key="slot" #[slot]>
            <MDCSlot :name="slot" unwrap="div">
              {{ slots?.[slot] }}
            </MDCSlot>
          </template>
        </component>
      </div>
    </div>

    <MDCRenderer
      v-if="ast"
      :body="ast.body"
      :data="ast.data"
      class="[&_pre]:!rounded-t-none [&_div.my-5]:!mt-0"
    />
  </div>
</template>
