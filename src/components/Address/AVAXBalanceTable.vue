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
                        <td class="text-right balance">{{ item.balance }} <span>AVAX</span></td>
                    </tr>
                </tbody>
            </template>
        </v-simple-table>
    </div>
</template>

<script lang="ts">
import "reflect-metadata";
import { Vue, Component, Prop } from "vue-property-decorator";
import Big from "big.js";

@Component({
    components: {},
})
export default class AVAXBalanceTable extends Vue {
	@Prop() unlockedX!: Big;
	
	isAjax: boolean = true;
    balances: any[] = [
        {
            name: "Locked",
            balance: this.lockedP.plus(this.lockedX),
        },
        {
            name: "Unlocked",
            balance: this.unlockedP.plus(this.unlockedX),
        },
        {
            name: "Staked",
            balance: this.staked,
        },
        {
            name: "Total Balance",
            balance: this.totalAVAXBalance,
        },
    ];

    get lockedP(): Big {
        return Big(0);
    }

    get lockedX(): Big {
        return Big(0);
    }

    get unlockedP(): Big {
        return Big(0);
    }

    get staked(): Big {
        return Big(0);
    }

    get totalAVAXBalance(): Big {
		return this.lockedP
			.plus(this.lockedX)
			.plus(this.unlockedP)
			.plus(this.unlockedX)
			.plus(this.staked);
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
