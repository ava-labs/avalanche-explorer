<template>
    <Component
        :is="viewerSmall"
        v-if="small"
        :payload="payload"
        class="nft_payload_view"
    ></Component>
    <Component
        :is="viewer"
        v-else
        :payload="payload"
        class="nft_payload_view"
    ></Component>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { PayloadBase } from 'avalanche/dist/utils'

import UrlPayloadView from '@/components/misc/NftPayloadView/views/UrlPayloadView.vue'
import UtfPayloadView from '@/components/misc/NftPayloadView/views/UtfPayloadView.vue'
import JsonPayloadView from '@/components/misc/NftPayloadView/views/JsonPayloadView.vue'

import UrlPayloadViewSmall from '@/components/misc/NftPayloadView/views_small/UrlPayloadView.vue'
import UtfPayloadViewSmall from '@/components/misc/NftPayloadView/views_small/UtfPayloadView.vue'
import JsonPayloadViewSmall from '@/components/misc/NftPayloadView/views_small/JsonPayloadView.vue'

@Component({
    components: {
        UrlPayloadView,
        UtfPayloadView,
        JsonPayloadView,
        UrlPayloadViewSmall,
        UtfPayloadViewSmall,
        JsonPayloadViewSmall,
    },
})
export default class NftPayloadView extends Vue {
    @Prop() payload!: PayloadBase
    @Prop({ default: false }) small!: boolean

    get viewer() {
        switch (this.payload.typeID()) {
            // UTF 8
            case 1:
                return UtfPayloadView
            // JSON
            case 24:
                return JsonPayloadView
            // url
            case 27:
                return UrlPayloadView
            default:
                return UtfPayloadView
        }
    }

    get viewerSmall() {
        switch (this.payload.typeID()) {
            // UTF 8
            case 1:
                return UtfPayloadViewSmall
            // JSON
            case 24:
                return JsonPayloadViewSmall
            // url
            case 27:
                return UrlPayloadViewSmall
            default:
                return UtfPayloadViewSmall
        }
    }
}
</script>
<style scoped>
.nft_payload_view {
    overflow: hidden;
    padding: 20px 0;
}
</style>
