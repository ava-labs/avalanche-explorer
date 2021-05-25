<template>
    <img v-if="img_types.includes(fileType)" :src="url" />
    <LogoFallback v-else></LogoFallback>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { URLPayload } from 'avalanche/dist/utils'

@Component
export default class UrlPayloadView extends Vue {
    @Prop() payload!: URLPayload

    img_types = [
        'jpeg',
        'jpg',
        'gif',
        'png',
        'apng',
        'svg',
        'bmp',
        'ico',
        'webp',
    ]
    valid_types = this.img_types.concat(['pdf'])

    get url() {
        return this.payload.getContent().toString()
    }

    get fileType(): string | null {
        const split = this.url.split('.')
        if (split.length === 1) return null // Couldn't find extension

        const extension: string = split[split.length - 1]
        if (!this.valid_types.includes(extension)) return null // invalid

        return extension
    }
}
</script>
<style scoped lang="scss">
img {
    width: 24px;
    height: 24px;
    display: block;
    object-fit: cover;
}
</style>
