<template>
    <div class="utxo_new_row">
        <!-- ADDRESS -->
        <span class="force-ellipsis">
            <router-link
                v-for="({ address, displayAddress }, i) in utxo.addresses"
                :key="i"
                :to="`/address/X-${address}`"
                class="monospace"
                >{{ displayAddress }}</router-link
            >
        </span>

        <!-- TYPE -->
        <div class="type">
            {{ utxo.outputType | getOutputType }}
        </div>

        <!-- AMOUNT -->
        <div>
            <p>
                <span class="monospace">{{ amount }}</span>
                <b>{{ symbol }}</b>
            </p>
        </div>

        <!-- REDEEMING TX LINK -->
        <span>
            <template v-if="redeemed">
                <!-- ADD CONDITIONAL -->
                <router-link :to="`/tx/${txId}`"
                    ><fa icon="check-circle" class="redeemed"></fa
                ></router-link>
            </template>
            <template v-else>
                <fa icon="check-circle"></fa>
            </template>
        </span>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { ITransactionOutput } from '@/store/modules/transactions/models.ts'
import { Asset } from '@/js/Asset'
import { getOutputType } from '@/services/transactions'

@Component({
    filters: {
        getOutputType,
    },
})
export default class UtxoRowOutput extends Vue {
    @Prop() utxo!: ITransactionOutput
    @Prop() type!: string

    get asset(): Asset {
        return this.$store.state.assets[this.utxo.assetID]
    }

    get symbol(): string {
        return this.asset ? this.asset.symbol : this.utxo.assetID
    }

    get amount(): string {
        const denomination = this.asset ? this.asset.denomination : 0
        return this.utxo.amount
            .div(Math.pow(10, denomination))
            .toLocaleString(denomination)
    }

    get txId(): string {
        const redeemingID = this.utxo.redeemingTransactionID

        return this.type === 'output'
            ? redeemingID === null || redeemingID === ''
                ? '-'
                : redeemingID
            : redeemingID === null || redeemingID === ''
            ? '-'
            : this.utxo.transactionID
    }

    get redeemed(): boolean {
        const redeemingID = this.utxo.redeemingTransactionID

        return this.type === 'output'
            ? redeemingID === null || redeemingID === ''
                ? false
                : true
            : redeemingID === null || redeemingID === ''
            ? false
            : false
    }
}
</script>

<style scoped lang="scss">
.type {
    color: var(--grey-300);
}
</style>
