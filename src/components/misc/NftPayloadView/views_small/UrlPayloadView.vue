<template>
    <div class="url_payload_view">
        <img v-if="img_types.includes(fileType)" :src="url" />
        <div v-else class="unknown">
            <p>
                <span>URL</span>
            </p>
            <a :href="url" target="_blank">{{ url }}</a>
            <p class="warn">Do NOT click links you do not trust.</p>
        </div>
    </div>
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
.url_payload_view {
    height: 100%;
    width: 100%;
    margin: 10px 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
}

.unknown,
.warn {
    background-color: var(--bg-light);
    text-align: center;
    padding: 12px 8px;
    word-break: break-all;
    font-size: 13px;
    span {
        color: var(--primary-color-light);
        font-size: 13px;
    }
}

.warn {
    color: var(--error);
    word-break: normal;
    font-size: 11px;
    opacity: 0.6;
}
</style>
