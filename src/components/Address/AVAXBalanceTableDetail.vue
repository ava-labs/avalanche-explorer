<template>
    <div class="avax_balance_table">
        <v-simple-table>
            <template v-slot:default>
                <thead>
                    <tr class="grid_headers">
                        <th class="text-left">Type</th>
                        <th class="text-right chain"></th>
                        <th class="text-right balance">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, i) in balances" :key="i">
                        <td class="text-left">{{ item.name }}</td>
                        <td class="text-right chain">{{ item.chain }}</td>
                        <td class="text-right balance">
                            {{ item.balance }} <span>AVAX</span>
                        </td>
                    </tr>
                </tbody>
            </template>
        </v-simple-table>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import Big from 'big.js'

@Component({
    components: {},
})
export default class AVAXBalanceTableDetail extends Vue {
    @Prop() pUnlocked!: Big
    @Prop() pLockedStakeable!: Big
    @Prop() pLockedNotStakeable!: Big
    @Prop() pStaked!: Big
    @Prop() xUnlocked!: Big
    @Prop() xLocked!: Big
    @Prop() cUnlocked!: Big

    balances: any[] = [
        {
            name: 'Unlocked',
            chain: 'Platform',
            balance: this.pUnlocked,
        },
        {
            name: 'Locked (Stakeable)',
            chain: 'Platform',
            balance: this.pLockedStakeable,
        },
        {
            name: 'Locked (Not-Stakeable)',
            chain: 'Platform',
            balance: this.pLockedNotStakeable,
        },
        {
            name: 'Staked',
            chain: 'Platform',
            balance: this.pStaked,
        },
        {
            name: 'Unlocked',
            chain: 'Exchange',
            balance: this.xUnlocked,
        },
        {
            name: 'Locked',
            chain: 'Exchange',
            balance: this.xLocked,
        },
        {
            name: 'Unlocked',
            chain: 'XC Shared Memory',
            balance: this.cUnlocked,
        },
        {
            name: 'Total Balance',
            chain: '',
            balance: this.totalAVAX,
        },
    ]

    get totalAVAX(): Big {
        return this.pUnlocked
            .plus(this.pLockedStakeable)
            .plus(this.pLockedNotStakeable)
            .plus(this.pStaked)
            .plus(this.xUnlocked)
            .plus(this.xLocked)
            .plus(this.cUnlocked)
    }
}
</script>

<style scoped lang="scss">
.avax_balance_table {
    margin-top: 30px;
    margin-bottom: 30px;
    max-width: 500px;
}

.text-left {
    padding-left: 0;
}

.chain {
    width: 60px;
    font-size: 12px;
    color: $primary-color-light;
    padding-left: 0;
    padding-right: 0;
}

.text-right,
.v-data-table thead th.text-right {
    text-align: right;
    padding-right: 0;
}

.v-data-table thead th.balance {
    padding-right: 44px;
}

.balance {
    span {
        display: inline-block;
        width: 38px;
        opacity: 0.4;
        text-align: left;
        padding-left: 4px;
    }
}

@include smOnly {
}

@include xsOrSmaller {
}
</style>
