<template>
    <section class="card meta">
        <header class="header">
            <h2 v-if="alias">{{alias}}</h2>
            <h2 v-else>{{prefix}}-{{addressID}}</h2>
        </header>
        <article class="meta_row">
            <p class="label">Address</p>
            <p class="addr">
                <span>{{prefix}}-{{addressID}}</span>
                <CopyText :value="`${prefix}-${addressID}`" class="copy_but"></CopyText>
                <span class="alias" v-if="alias">{{alias}}</span>
            </p>
        </article>
        <article class="meta_row">
            <p class="label">AVAX Balance</p>
            <div class="symbol">
                <p>{{avaxBalance.toLocaleString(this.assetsMap[AVAX].denomination)}} AVAX</p>
                <div class="avax_balance_container">
                    <AVAXBalanceTable 
                        :unlockedX="avaxBalance"
                    ></AVAXBalanceTable>
                    <v-alert
                        class="info_alert"
                        v-if="isManhattan"
                        dense
                        type="info"
                        color="info"
                    >
                <p class="title"><b>THIS PAGE DISPLAYS ONLY YOUR UNLOCKED AVAX TOKENS.</b></p>
                     <p class="description">To view your full AVAX wallet balance, please visit the <a class="info_link" href="https://wallet.avax.network">Avalanche Wallet</a> and select the "Manhattan Testnet" network endpoint.</p>
                </v-alert>
                </div>
            </div>
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
import AVAXBalanceTable from "@/components/Address/AVAXBalanceTable.vue";
import { IAddress, IBalance } from '@/js/IAddress'; 
import Big from "big.js";
import { AVAX_ID } from "@/store/index";
import { DEFAULT_NETWORK_ID } from "@/store/modules/network/network";

@Component({
    components: {
        CopyText,
        BalanceTable,
        AVAXBalanceTable
    }
})
export default class Metadata extends Vue {
    @Prop() metaData!: IAddress;
    @Prop() addressID!: string;
    @Prop() alias!: string;
    @Prop() totalTransactionCount!: number;
    @Prop() totalUtxoCount!: number;
    @Prop() assets!: IBalance[];
    @Prop() prefix!: string;

    get isManhattan(): boolean {
        return (DEFAULT_NETWORK_ID === 0) ? true : false;
    }

    get AVAX(): string {
        return AVAX_ID;
    } 

    get assetsMap(): any {
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

.avax_balance_container {
    /* display: flex; */
}

</style>

<style lang="scss">


.info_alert {
    margin-top: 15px;
    max-width: 500px;
    line-height: 1.5em;
    padding: 30px !important;
    box-sizing: border-box;

    p.title {
        padding-top: 3px
    }
    p.description {
        padding-top: 1rem;
    }
}

.detail {
    .info_alert {
        a {
            display: inline !important;
            text-decoration: underline !important;
            color: $white !important;
        }
    }
}

.v-alert__content {
    word-break: normal;
}

.v-data-table__wrapper {
    color: $primary-color;

    tr:last-of-type {
        font-weight: 700;

        span {
            font-weight: 400;
        }
    }
}

</style>
