<!--Used inside the JsonPayload.vue component-->
<template>
    <img v-if="!isError" :src="img" />
    <LogoFallback v-else></LogoFallback>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { JSONPayload } from 'avalanche/dist/utils'
import { IGenericNft } from '@/js/NFT'
import LogoFallback from '@/components/Assets/LogoFallback.vue'

@Component({
    components: {
        LogoFallback,
    },
})
export default class UtfPayloadView extends Vue {
    @Prop() payload!: JSONPayload
    isError = false
    jsonData: IGenericNft | null = null

    get content(): string {
        return this.payload.getContent().toString()
    }

    get img() {
        return this.jsonData?.img
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
img {
    display: block;
    object-fit: cover;
    object-position: center;
    width: 24px;
    height: 24px;
}
</style>
