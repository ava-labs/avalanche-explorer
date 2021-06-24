<template>
    <div v-if="payload">
        <NftPayloadView :payload="payloadBase" :small="true" />
        <div class="two_col">
            <div>
                <div class="utxo_label">Group ID</div>
                <div>{{ groupID }}</div>
            </div>
            <div class="payload">
                <div class="utxo_label">
                    {{ payloadBase.typeID() | getType }} Payload
                </div>
                <pre
                    v-if="payloadBase.typeID() === 24"
                    class="monospace code"
                    >{{ JSON.stringify(JSON.parse(text), null, 2) }}</pre
                >
                <div v-else class="monospace code">{{ text }}</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { pushPayload } from '@/helper'
import NftPayloadView from '@/components/misc/NftPayloadView/NftPayloadView.vue'
import { getNFTType } from '@/services/transactions'

@Component({
    components: {
        NftPayloadView,
    },
    filters: {
        getType: getNFTType,
    },
})
export default class UtxoNFTPayload extends Vue {
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

    get text(): string {
        return this.payloadBase.getContent().toString()
    }
}
</script>

<style scoped lang="scss">
.two_col {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    > div:first-of-type {
        flex: 1;
    }

    > div:nth-of-type(2) {
        flex: 2;
    }
}

.payload {
    overflow: hidden;
}

.code {
    font-size: 10px;
}

pre {
    overflow-x: auto;
    white-space: pre-wrap;
    white-space: -moz-pre-wrap;
    white-space: -pre-wrap;
    white-space: -o-pre-wrap;
    word-wrap: break-word;
}
</style>
