<template>
    <div class="balances_container">
        <div class="bar">
            <p class="count">
                {{ Object.keys(assets).length | pluralize('asset') }} found
            </p>
        </div>
        <div v-if="assets.length > 0" class="grid_headers balance_row">
            <p>
                Symbol
                <Tooltip
                    content="An arrangement of letters representing an asset"
                />
            </p>
            <p class="name">
                Name
                <Tooltip content="Name for the asset" />
            </p>
            <p class="balance">
                <Tooltip content="Balance held by this address" />
                Balance
            </p>
            <p class="sent">
                <Tooltip content="Total sent by this address" />Sent
            </p>
            <p class="received">
                <Tooltip content="Total received by this address" />
                Received
            </p>
            <p class="utxos">
                <Tooltip
                    content="Total UTXOs that are currently spendable by this address (includes locked and unlocked UTXOs)"
                />
                Spendable UTXOs
            </p>
        </div>
        <BalanceRow
            v-for="(asset, index) in assets"
            :key="index"
            :asset="asset"
        />
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import Tooltip from '@/components/rows/Tooltip.vue'
import BalanceRow from '@/components/Address/BalanceRow.vue'
import { IBalanceX } from '@/services/addresses/models'

@Component({
    components: {
        Tooltip,
        BalanceRow,
    },
})
export default class BalanceTable extends Vue {
    @Prop() assets!: IBalanceX[]
}
</script>

<style scoped lang="scss">
.balances_container {
    overflow-x: scroll;

    .count {
        margin-bottom: 12px;
    }

    .grid_headers {
        font-weight: 500;
        font-size: 12px;
    }

    .balance,
    .sent,
    .received,
    .utxos {
        text-align: right;
    }

    .grid_headers {
        .balance,
        .sent,
        .received {
            padding-right: 44px;
        }
    }

    .balance_row {
        display: grid;
        grid-template-columns: 60px 1fr 200px 200px 200px 150px;
        padding: 10px 0;
        border-bottom: 1px solid #e7e7e7;
        column-gap: 10px;

        > * {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }

        &:last-of-type {
            border: none;
        }
    }
}

@include mdOnly {
    .balances_container {
        .balance_row {
            grid-template-columns: 60px 1fr 200px 200px 200px 150px;
        }
    }
}

@include smOnly {
    .balances_container {
        .balance_row {
            grid-template-columns: 50px 100px 200px 200px 200px 150px;
        }
    }
}
</style>
