<template>
    <div class="blockchains">
        <div class="card">
            <div class="header">
                <h2>Blockchains</h2>
                <template v-show="!loading && subnetsLoaded">
                    <div class="bar">
                        <p class="count">
                            {{ totalBlockchains.toLocaleString() }} blockchains
                            found
                        </p>
                    </div>
                </template>
            </div>
            <template v-if="loading && !subnetsLoaded">
                <v-progress-circular
                    key="1"
                    :size="16"
                    :width="2"
                    color="#E84970"
                    indeterminate
                ></v-progress-circular>
            </template>
            <template v-else>
                <BlockchainDataTable
                    :blockchains="blockchains"
                    :links="true"
                    :subnets="true"
                ></BlockchainDataTable>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import { Mixins, Component } from 'vue-property-decorator'
import BlockchainDataTable from '@/components/Blockchain/BlockchainDataTable.vue'
import { PlatformGettersMixin } from '@/store/modules/platform/platform.mixins'

@Component({
    components: {
        BlockchainDataTable,
    },
})
export default class Blockchains extends Mixins(PlatformGettersMixin) {
    loading = true

    async created() {
        this.loading = false
    }

    get subnetsLoaded() {
        return this.$store.state.Platform.subnetsLoaded
    }

    get blockchains() {
        return this.$store.state.Platform.blockchains
    }

    get totalBlockchains() {
        return this.getTotalBlockchains()
    }
}
</script>

<style scoped lang="scss">
.blockchains {
    font-size: 12px;
}

.header {
    padding-bottom: 20px;
    margin-bottom: 10px;

    .count {
        color: #808080;
    }
}

.bar {
    display: flex;
    align-items: center;
    > p {
        flex-grow: 1;
    }
}

.bar-table {
    padding-top: 30px;
    display: flex;
    justify-content: flex-end;
}

@include smOnly {
    .table_headers {
        display: none;
    }
}
</style>
