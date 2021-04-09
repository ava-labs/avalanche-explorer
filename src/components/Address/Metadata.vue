<template>
    <section class="card meta">
        <header class="header">
            <h2 v-if="alias">{{ alias }}</h2>
            <h2 v-else>{{ addressID }}</h2>
        </header>
        <article class="meta_row">
            <p class="label">Address</p>
            <p class="addr">
                <span>{{ addressID }}</span>
                <CopyText :value="`${addressID}`" class="copy_but" />
                <span v-if="alias" class="alias">{{ alias }}</span>
            </p>
        </article>
        <article class="meta_row">
            <p class="label">AVAX Balance</p>
            <div class="symbol">
                <div class="avax_balance_container">
                    <div>
                        <v-tabs show-arrows>
                            <v-tab>Summary</v-tab>
                            <v-tab>Detail</v-tab>
                            <v-tab-item class="tab_content">
                                <AVAXBalanceTableSummary
                                    :p-unlocked="P_unlocked"
                                    :p-locked-stakeable="P_lockedStakeable"
                                    :p-locked-not-stakeable="
                                        P_lockedNotStakeable
                                    "
                                    :p-staked="P_staked"
                                    :x-unlocked="X_unlocked"
                                    :x-locked="X_locked"
                                />
                            </v-tab-item>
                            <v-tab-item class="tab_content">
                                <AVAXBalanceTableDetail
                                    :p-unlocked="P_unlocked"
                                    :p-locked-stakeable="P_lockedStakeable"
                                    :p-locked-not-stakeable="
                                        P_lockedNotStakeable
                                    "
                                    :p-staked="P_staked"
                                    :x-unlocked="X_unlocked"
                                    :x-locked="X_locked"
                                />
                            </v-tab-item>
                        </v-tabs>
                    </div>
                </div>
            </div>
        </article>
        <article class="meta_row">
            <p class="label">X-Chain Portfolio</p>
            <BalanceTable :assets="assets" />
        </article>
    </section>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import CopyText from '@/components/misc/CopyText.vue'
import BalanceTable from '@/components/Address/BalanceTable.vue'
import AVAXBalanceTableSummary from '@/components/Address/AVAXBalanceTableSummary.vue'
import AVAXBalanceTableDetail from '@/components/Address/AVAXBalanceTableDetail.vue'
import { IAddress, IBalanceX } from '@/services/addresses/models'
import Big from 'big.js'
import { AVAX_ID } from '@/known_assets'

@Component({
    components: {
        CopyText,
        BalanceTable,
        AVAXBalanceTableSummary,
        AVAXBalanceTableDetail,
    },
})
export default class Metadata extends Vue {
    @Prop() metaData!: IAddress
    @Prop() addressID!: string
    @Prop() alias!: string
    @Prop() totalTransactionCount!: number
    @Prop() totalUtxoCount!: number
    @Prop() assets!: IBalanceX[]
    @Prop() prefix!: string

    get AVAX(): string {
        return AVAX_ID
    }

    get assetsMap(): any {
        return this.$store.state.assets
    }

    // P-Chain AVAX balance
    get P_unlocked(): Big {
        return this.metaData.P_unlocked
    }

    get P_lockedStakeable(): Big {
        return this.metaData.P_lockedStakeable
    }

    get P_lockedNotStakeable(): Big {
        return this.metaData.P_lockedNotStakeable
    }

    get P_staked(): Big {
        return this.metaData.P_staked
    }

    // X-Chain AVAX balance
    get X_unlocked(): Big {
        return this.metaData.X_unlocked
    }

    get X_locked(): Big {
        return this.metaData.X_locked
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
    max-width: 500px;
    line-height: 1.5em;
    padding: 30px !important;
    box-sizing: border-box;

    p.title {
        padding-top: 3px;
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
