<template>
    <div v-if="payload">
        <NFTLogoPayloadView :payload="payloadBase" />
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { pushPayload } from '@/helper'
import NFTLogoPayloadView from '@/components/Assets/LogoPayloadView.vue'

@Component({
    components: {
        NFTLogoPayloadView,
    },
})
export default class NFTLogoPayload extends Vue {
    @Prop() payload!: string
    @Prop() assetID!: string
    @Prop() groupID!: number

    get payloadBase() {
        if (!this.payload) return undefined
        const payload = pushPayload(
            this.payload as string,
            this.assetID,
            this.groupID
        )
        return (payload as any)[this.groupID][0]
    }
}
</script>

<style scoped lang="scss">
.payload {
    overflow: hidden;
}

.code {
    font-size: 10px;
}
</style>
