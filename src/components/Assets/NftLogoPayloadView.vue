<template>
    <Component
        :is="viewer"
        :payload="payload"
        class="nft_payload_view"
    ></Component>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { PayloadBase } from 'avalanche/dist/utils'

import Url from '@/components/misc/NftPayloadView/views_logo/UrlPayloadView.vue'
import Utf from '@/components/misc/NftPayloadView/views_logo/UtfPayloadView.vue'
import Json from '@/components/misc/NftPayloadView/views_logo/JsonPayloadView.vue'

@Component({
    components: {
        Url,
        Utf,
        Json,
    },
})
export default class NftLogoPayloadView extends Vue {
    @Prop() payload!: PayloadBase
    @Prop({ default: false }) small!: boolean

    get viewer() {
        switch (this.payload.typeID()) {
            case 1:
                return Utf
            case 24:
                return Json
            case 27:
                return Url
            default:
                return Utf
        }
    }
}
</script>
<style scoped>
.nft_payload_view {
    overflow: auto;
    padding: 20px 0;
}
</style>
