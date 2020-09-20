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
            <div class="symbol">
                <p>{{avaxBalance.toLocaleString(this.assetsMap[AVAX].denomination)}} AVAX</p>
                <v-alert
                    class="info_alert"
                    v-if="isManhattan"
                    dense
                    type="info"
                >
                <p class="title"><b>THIS PAGE DISPLAYS ONLY YOUR UNLOCKED AVAX TOKENS.</b></p>
                     <p class="description">To view your full AVAX wallet balance, please visit the <a class="info_link" href="https://wallet.avax.network">Avalanche Wallet</a> and select the "Manhattan Testnet" network endpoint.</p>
                </v-alert>
            </div>
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
import { AVAX_ID } from "@/store/index";
import { DEFAULT_NETWORK_ID } from "@/store/modules/network/network";

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

    get isManhattan(): boolean {
        return (DEFAULT_NETWORK_ID === 0) ? true : false;
    }

    get AVAX(): string {
        return AVAX_ID;
    } 

    get assetsMap(): any {
        console.log(Object.keys(this.$store.state.assets));
        return this.$store.state.assets;
    }

    get avaxBalance(): Big {
        return this.metaData.avaxBalance;
    }
}
</script>

<style scoped lang="scss">


.addr {
    text-overflow: ellipsis;
    word-break: keep-all;
    white-space: nowrap;

    .alias {
        background-color: #e6ffe6;
        border: 1px solid $green;
        color: $green;
        width: max-content;
        padding: 4px 8px;
        margin: 0px 30px;
    }
}

</style>

<style lang="scss">


.info_alert {
    margin-top: 15px;
    max-width: 600px;
    line-height: 1.25em;

    p.title {
        padding-top: 3px
    }
    p.description {
        padding-top: 1rem;
    }
}

.detail a {
    display: inline !important;
    color: $white !important;
    text-decoration: underline !important;
}
</style>
