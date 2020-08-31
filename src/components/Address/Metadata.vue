<template>
    <section class="card meta">
        <header class="header">
            <h2 v-if="alias">{{alias}}</h2>
            <h2 v-else>X-{{addressID}}</h2>
        </header>
        <article class="meta_row">
            <p class="label">Address</p>
            <p class="addr">
                <span>X-{{addressID}}</span>
                <CopyText :value="`X-${addressID}`" class="copy_but"></CopyText>
                <span class="alias" v-if="alias">{{alias}}</span>
            </p>
        </article>
        <article class="meta_row">
            <p class="label">AVAX Balance</p>
            <p>{{avaxBalance.toLocaleString(this.assetsMap["nznftJBicce1PfWQeNEVBmDyweZZ6zcM3p78z9Hy9Hhdhfaxm"].denomination)}} AVAX</p>
        </article>
        <article class="meta_row">
            <p class="label">Transactions</p>
            <p>{{totalTransactionCount.toLocaleString()}}</p>
        </article>
        <article class="meta_row">
            <p class="label">Portfolio</p>
            <BalanceTable :assets="assets"></BalanceTable>
        </article>
    </section>
</template>

<script lang="ts">
import "reflect-metadata";
import { Vue, Component, Prop } from "vue-property-decorator";
import CopyText from "@/components/misc/CopyText.vue";
import BalanceTable from "@/components/Address/BalanceTable.vue";
import { IAddress, IBalance } from '@/js/IAddress'; 
import Big from "big.js";

@Component({
    components: {
        CopyText,
        BalanceTable
    }
})
export default class Metadata extends Vue {
    @Prop() metaData!: IAddress;
    @Prop() addressID!: string;
    @Prop() alias!: string;
    @Prop() totalTransactionCount!: number;
    @Prop() totalUtxoCount!: number;
    @Prop() assets!: IBalance[];    

    get assetsMap(): any {
        return this.$store.state.assets;
    }

    get avaxBalance(): Big {
        return this.metaData.avaxBalance;
    }
}
</script>

<style scoped lang="scss">
@use "../../main";

.addr {
    text-overflow: ellipsis;
    word-break: keep-all;
    white-space: nowrap;

    .alias {
        background-color: #e6ffe6;
        border: 1px solid main.$green;
        color: main.$green;
        width: max-content;
        padding: 4px 8px;
        margin: 0px 30px;
    }
}

</style>

<style lang="scss">
@use "../../main";

</style>
