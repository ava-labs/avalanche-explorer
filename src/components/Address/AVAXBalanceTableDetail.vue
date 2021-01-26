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
    @Prop() unlockedX!: Big
    @Prop() P_unlocked!: Big
    @Prop() P_lockedStakeable!: Big
    @Prop() P_lockedNotStakeable!: Big
    @Prop() P_staked!: Big
    @Prop() X_unlocked!: Big
    @Prop() X_locked!: Big

    balances: any[] = [
        {
            name: 'Unlocked',
            chain: 'Platform',
            balance: this.P_unlocked,
        },
        {
            name: 'Locked (Stakeable)',
            chain: 'Platform',
            balance: this.P_lockedStakeable,
        },
        {
            name: 'Locked (Not-Stakeable)',
            chain: 'Platform',
            balance: this.P_lockedNotStakeable,
        },
        {
            name: 'Staked',
            chain: 'Platform',
            balance: this.P_staked,
        },
        {
            name: 'Unlocked',
            chain: 'Exchange',
            balance: this.X_unlocked,
        },
        {
            name: 'Locked',
            chain: 'Exchange',
            balance: this.X_locked,
        },
        // {
        //     name: 'Total Balance',
        //     chain: '',
        //     balance: this.totalAVAX,
        // },
    ]

    // get totalAVAX(): Big {
    //     return this.P_unlocked.plus(this.P_lockedStakeable)
    //         .plus(this.P_lockedNotStakeable)
    //         .plus(this.P_staked)
    //         .plus(this.X_unlocked)
    //         .plus(this.X_locked)
    // }
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

@include xsOnly {
}
</style>
