<script setup lang="ts">
import { withoutTrailingSlash } from 'ufo'
import { findPageHeadline } from '#ui-pro/utils/content'

const route = useRoute()

definePageMeta({
  layout: 'docs',
})

const { data: page } = await useAsyncData(route.path, () => queryContent(route.path).findOne())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const { data: surround } = await useAsyncData(`${route.path}-surround`, () => {
  return queryContent()
    .where({
      _extension: 'md',
      navigation: {
        $ne: false,
      },
    })
    .only(['title', 'description', '_path'])
    .findSurround(withoutTrailingSlash(route.path))
}, { default: () => [] })

const headline = computed(() => findPageHeadline(page.value))

useSeoMeta({
  titleTemplate: '%s - Nuxt QRCode',
  title: page.value.navigation?.title || page.value.title,
  ogTitle: `${page.value.navigation?.title || page.value.title} - Nuxt QRCode`,
  description: page.value.seo?.description || page.value.description,
  ogDescription: page.value.seo?.description || page.value.description,
})

defineOgImageComponent('Docs', {
  headline: headline.value,
  title: page.value.title,
  description: page.value.seo?.description || page.value.description,
})

const communityLinks = computed(() => [{
  icon: 'i-heroicons-pencil-square',
  label: 'Edit this page',
  to: `https://github.com/sandros94/nuxt-qrcode/edit/docs/content/${page?.value?._file}`,
  target: '_blank',
}, {
  icon: 'i-heroicons-star',
  label: 'Star on GitHub',
  to: 'https://github.com/sandros94/nuxt-qrcode',
  target: '_blank',
}])
// , {
//   label: 'Roadmap',
//   icon: 'i-heroicons-map',
//   to: '/roadmap',
// }])
</script>

<template>
  <UPage v-if="page">
    <UPageHeader
      :title="page.title"
      :links="page.links"
      :headline="headline"
    >
      <template #description>
        <MDC
          v-if="page.description"
          :value="page.description"
          unwrap="p"
        />
      </template>
    </UPageHeader>

    <UPageBody>
      <ContentRenderer
        v-if="page.body"
        :value="page"
      />

      <USeparator />

      <UContentSurround :surround="(surround as any)" />
    </UPageBody>

    <template
      v-if="page?.body?.toc?.links?.length"
      #right
    >
      <UContentToc
        :links="page.body.toc.links"
        class="z-[2]"
      >
        <template #bottom>
          <USeparator
            v-if="page.body?.toc?.links?.length"
            type="dashed"
          />

          <UPageLinks
            title="Community"
            :links="communityLinks"
          />
        </template>
      </UContentToc>
    </template>
  </UPage>
</template>
