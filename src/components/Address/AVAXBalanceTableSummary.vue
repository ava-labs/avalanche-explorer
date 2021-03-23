<template>
    <div class="avax_balance_table">
        <v-simple-table>
            <template v-slot:default>
                <thead>
                    <tr class="grid_headers">
                        <th class="text-left">Type</th>
                        <th class="text-right balance">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in balances" :key="item.name">
                        <td class="text-left">{{ item.name }}</td>
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
export default class AVAXBalanceTableSummary extends Vue {
    @Prop() unlockedX!: Big
    @Prop() P_unlocked!: Big
    @Prop() P_lockedStakeable!: Big
    @Prop() P_lockedNotStakeable!: Big
    @Prop() P_staked!: Big
    @Prop() X_unlocked!: Big
    @Prop() X_locked!: Big

    balances: any[] = [
        {
            name: 'Locked',
            balance: this.totalAVAXLocked,
        },
        {
            name: 'Unlocked',
            balance: this.totalAVAXUnlocked,
        },
        {
            name: 'Staked',
            balance: this.totalAVAXStaked,
        },
        {
            name: 'Total Balance',
            balance: this.totalAVAX,
        },
    ]

    get totalAVAXStaked(): Big {
        return this.P_staked
    }

    get totalAVAXLocked(): Big {
        return this.P_lockedStakeable.plus(this.P_lockedNotStakeable).plus(
            this.X_locked
        )
    }

    get totalAVAXUnlocked(): Big {
        return this.P_unlocked.plus(this.X_unlocked)
    }

    get totalAVAX(): Big {
        return this.P_unlocked.plus(this.P_lockedStakeable)
            .plus(this.P_lockedNotStakeable)
            .plus(this.P_staked)
            .plus(this.X_unlocked)
            .plus(this.X_locked)
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
