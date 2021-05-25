<template>
    <div v-if="block" class="two_col">
        <div>
            <div class="utxo_label">Block</div>
            <div>
                <a class="block" :href="cURL">{{ block }}</a>
            </div>
        </div>
        <div v-if="nonce > 0">
            <div class="utxo_label">Nonce</div>
            <div>{{ nonce }}</div>
        </div>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import {
    cChainExplorerURL,
    cChainExplorerURL_test,
    DEFAULT_NETWORK_ID,
} from '@/store/modules/network/network'

@Component({})
export default class UtxoBlock extends Vue {
    @Prop() block!: string
    @Prop() nonce!: number

    get cURL() {
        return `${
            DEFAULT_NETWORK_ID === 1
                ? cChainExplorerURL
                : cChainExplorerURL_test
        }/blocks/${this.block}`
    }
}
</script>

<style scoped lang="scss">
.v-application a.block {
    &:hover {
        opacity: 0.7;
        text-decoration: none;
    }
}
</style>
