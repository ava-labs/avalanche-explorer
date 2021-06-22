<template>
    <div>
        <!-- MOBILE -->
        <template v-if="$vuetify.breakpoint.smAndDown">
            <v-col cols="12" class="py-2">
                <div class="buttons">
                    <TxParamsDialog @change="emitChange" />
                    <TxFilterDialog :chains="chains" @change="setFilter" />
                </div>
            </v-col>

            <TxList
                v-if="!loading && assetsLoaded"
                :transactions="filteredTransactions"
            />
            <v-progress-circular
                v-else
                key="1"
                :size="16"
                :width="2"
                color="#E84970"
                indeterminate
            />
        </template>
        <!-- DESKTOP -->
        <template v-else>
            <TxParams @change="emitChange" />
            <div class="two-col">
                <TxFilter :chains="chains" @change="setFilter" />
                <div class="right">
                    <TxList
                        v-if="!loading && assetsLoaded"
                        :transactions="filteredTransactions"
                    />
                    <v-progress-circular
                        v-else
                        key="1"
                        :size="16"
                        :width="2"
                        color="#E84970"
                        indeterminate
                    />
                </div>
            </div>
        </template>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import TxParamsDialog from '@/components/Transaction/TxParamsDialog.vue'
import TxParams from '@/components/Transaction/TxParams.vue'
import TxList from '@/components/Transaction/TxList.vue'
import TxFilterDialog from '@/components/Transaction/TxFilterDialog.vue'
import TxFilter from '@/components/Transaction/TxFilter.vue'
import { ChainMap } from '@/known_blockchains'
import { Transaction } from '@/js/Transaction'
import { ITransactionParams } from '@/services/transactions'

@Component({
    components: {
        TxParamsDialog,
        TxParams,
        TxFilterDialog,
        TxFilter,
        TxList,
    },
})
export default class TxInteractive extends Vue {
    @Prop() transactions!: Transaction[]
    @Prop() assetsLoaded!: boolean
    @Prop() loading!: boolean
    @Prop() chains!: ChainMap[]

    filters: string[] = []

    setFilter(val: string[]) {
        this.filters = val
    }

    get filteredTransactions() {
        return this.transactions.filter((tx) => {
            return this.filters.some((val) => val === tx.type)
        })
    }

    // simply passes value through to the data request layer above
    emitChange(params: ITransactionParams): void {
        this.$emit('change', params)
    }
}
</script>

<style scoped lang="scss">
.two-col {
    display: flex;
    flex-direction: row;

    .left {
        h4 {
            margin-top: 0;
        }
        flex-basis: 0 0 300px;
        margin-right: 60px;
    }

    .right {
        flex: 1;
    }
}

.buttons {
    display: flex;
    justify-content: space-between;
}
</style>
