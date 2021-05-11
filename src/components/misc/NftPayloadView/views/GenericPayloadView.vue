<!--Used inside the JsonPayload.vue component-->
<template>
    <div class="generic_payload_view">
        <template v-if="!isError">
            <div class="generic_view">
                <img :src="img" />
                <p v-if="title" class="nft_title">{{ title }}</p>
                <div v-if="desc" class="desc">{{ desc }}</div>
            </div>
        </template>
        <template v-else>
            <p>Failed to load generic NFT payload.</p>
        </template>
    </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { JSONPayload } from 'avalanche/dist/utils'
import { IGenericNft } from '@/js/NFT'

@Component
export default class UtfPayloadView extends Vue {
    @Prop() payload!: JSONPayload
    isError = false
    jsonData: IGenericNft | null = null

    get content(): string {
        return this.payload.getContent().toString()
    }

    get desc() {
        return this.jsonData?.desc
    }

    get img() {
        return this.jsonData?.img
    }

    get title() {
        return this.jsonData?.title
    }

    mounted() {
        try {
            this.jsonData = JSON.parse(this.content).avalanche
        } catch (e) {
            this.isError = true
        }
    }

    @Watch('payload')
    onPayloadChange() {
        try {
            this.jsonData = JSON.parse(this.content).avalanche
        } catch (e) {
            this.isError = true
        }
    }
}
</script>
<style scoped lang="scss">
.generic_view {
    position: relative;
    width: 100%;
    height: 220px;
    max-height: 100%;
    overflow: hidden;

    img {
        display: block;
        object-fit: cover;
        width: 100%;
        height: 100%;
        position: absolute;
    }

    p {
        font-size: 13px;
        padding: 12px 24px;
        word-break: break-word;
        overflow: scroll;
        background-color: var(--bg-light);
        color: var(--primary-color);
    }

    .nft_title {
        position: absolute;
        bottom: 0;
        width: 100%;
        font-size: 13px;
        background-color: #000000aa;
        color: #fff;
        transition-duration: 0.2s;
    }
}

.generic_view:hover {
    .desc {
        opacity: 1;
    }
    .nft_title {
        opacity: 0;
    }
}
.desc {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 0;
    font-size: 13px;
    transition-duration: 0.2s;
    color: #fff;
    text-align: center;
    padding: 14px;
    background-color: #000000bb;
}

@include xsOrSmaller {
    .generic_view {
        height: 100%;
    }
}
</style>
