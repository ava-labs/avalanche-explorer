<template>
    <div class="balance_row">
        <p v-if="asset.symbol" class="symbol">{{ asset.symbol }}</p>
        <p v-else class="no_symbol"></p>
        <router-link class="name_id" :to="`/asset/${asset.id}`">{{
            asset | nameOrID
        }}</router-link>
        <p class="balance">
            {{ asset.balance.toLocaleString(asset.denomination) }}
            <span>{{ asset.symbol }}</span>
        </p>
        <p class="sent">
            {{ asset.totalSent.toLocaleString(asset.denomination) }}
            <span>{{ asset.symbol }}</span>
        </p>
        <p class="received">
            {{ asset.totalReceived.toLocaleString(asset.denomination) }}
            <span>{{ asset.symbol }}</span>
        </p>
        <p class="utxos">{{ asset.utxoCount.toLocaleString() }}</p>
    </div>
</template>
<script lang="ts">
import { Asset } from '@/js/Asset'
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class BalanceRow extends Vue {
    @Prop() asset!: Asset
}
</script>
<style scoped lang="scss">
.balance_row {
    font-weight: 400;
    > * {
        align-self: center;
    }

    > div {
        display: flex;
    }

    p {
        overflow: hidden;
        font-size: 12px;
        text-overflow: ellipsis;
    }

    a {
        color: $black !important;
    }
}

.symbol {
    color: $secondary-color;
    background-color: $secondary-color-xlight;
    padding: 6px 12px;
    text-align: center;
    border-radius: 4px;
    min-height: 1em;
    font-weight: 400;
}

.no_symbol {
    color: transparent;
    background-color: transparent;
    padding: 6px 12px;
    text-align: center;
    border-radius: 4px;
    min-height: 1em;
}

.name_id {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
    font-size: 12px;
    font-weight: 400;
    text-decoration: none;
}

.balance,
.sent,
.received,
.utxos {
    text-align: right;
}

.balance,
.sent,
.received {
    span {
        display: inline-block;
        width: 38px;
        opacity: 0.4;
        text-align: left;
        padding-left: 4px;
    }
}

@include smOnly {
    .symbol {
        padding: 2px;
    }
}
</style>
