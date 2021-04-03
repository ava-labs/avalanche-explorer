<template>
    <div v-if="payload">
        <NftLogoPayloadView
            :payload="payloadBase"
            :size="logo"
        ></NftLogoPayloadView>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { pushPayload } from '@/helper'
import NftPayloadView from '@/components/misc/NftPayloadView/NftPayloadView.vue'

@Component({
    components: {
        NftPayloadView,
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
    overflow: scroll;
}

.code {
    font-size: 10px;
}
</style>
