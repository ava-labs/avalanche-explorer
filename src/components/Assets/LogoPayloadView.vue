<template>
    <Component :is="viewer" :payload="payload" class="nft_payload_view" />
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
export default class NFTLogoPayloadView extends Vue {
    @Prop() payload!: PayloadBase

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
    overflow: hidden;
    margin: 0;
    padding: 0;
    width: 24px;
    height: 24px;
}
</style>
