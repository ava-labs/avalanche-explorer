<template>
    <section class="stats">
        <article class="meta_row">
            <p class="meta_label">
                Block
                <Tooltip content="" />
            </p>
            <div class="meta_value values">
                {{ block.blockNumber }}
            </div>
        </article>
        <article class="meta_row">
            <p class="meta_label">
                Accepted
                <Tooltip
                    content="The date and time when this block was accepted by the Avalanche Network"
                />
            </p>
            <div class="meta_value values">
                {{ block.header.timestamp }}
            </div>
        </article>
        <article class="meta_row">
            <p class="meta_label">
                Header
                <Tooltip content="" />
            </p>
            <div class="meta_value values">
                {{ block.header }}
            </div>
        </article>
        <article class="meta_row">
            <p class="meta_label">
                Version
                <Tooltip content="" />
            </p>
            <div class="meta_value values">
                {{ block.version }}
            </div>
        </article>
    </section>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import Tooltip from '@/components/rows/Tooltip.vue'
import { EVMBlockQueryResponse } from '@/store/modules/blocks'

@Component({
    components: {
        Tooltip,
    },
    filters: {},
})
export default class EVMMetadata extends Vue {
    @Prop() block!: EVMBlockQueryResponse
    // get date(): Date {
    //     return new Date(this.block.timestamp)
    // }

    /**
     * parentHash: string // '0x38c50e6d69e590682fde94c6f66aa3596c5e0a9ccc7290f7ed876ed7008ee564'
    sha3Uncles: string // '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347'
    miner: string // '0x0100000000000000000000000000000000000000'
    stateRoot: string // '0x2d0a9ba7a1462a85c770e6d6d25ec10c7488707ed946977a14c934d4ef534506'
    transactionsRoot: string // '0x97d585d1361a1a605e996f9b4fcd170fe0002f97b8f41b0dd49778a6f28f81a5'
    receiptsRoot: string // '0x4b59332f20afb63eae88492640524f29451491d02abf59d9250136cb4a0adfdb'
    logsBloom: string // '0x00000000000000000000000000000000000100000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000008000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000004000000000000001020000000000000000000000000000000000000000000000000000000000002000000000001000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000'
    difficulty: string // '0x1'
    number: string // '0x3e8'
    gasLimit: string // '0x23e6441'
    gasUsed: string // '0x7d71'
    timestamp: string // '0x5fde8d3b'
    extraData: string // '0xd883010916846765746888676f312e31352e35856c696e75783ae348c32855703315cdd63cb0e75ee2d2fb932daab4d17377098975ab12e495'
    mixHash: string // '0x0000000000000000000000000000000000000000000000000000000000000000'
    nonce: string // '0x0000000000000000'
    extDataHash: string // '0x0000000000000000000000000000000000000000000000000000000000000000'
    hash: string // '0x7676d0aca0c753aaf36ceefc7be9a9340616dc07ddd7d254bc41db426bb72e56'
     */
}
</script>

<style scoped lang="scss"></style>
