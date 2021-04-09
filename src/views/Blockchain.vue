<template>
    <div class="detail">
        <v-breadcrumbs :items="breadcrumbs" />
        <Loader
            v-if="loading && !subnetsLoaded"
            :content-id="blockchainId"
            :message="'Fetching Blockchain Details'"
        />
        <template v-else>
            <Metadata :blockchain="blockchain" />
            <recent-transactions
                v-if="blockchain.indexed"
                class="card recent_tx"
            />
        </template>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Watch } from 'vue-property-decorator'
import Loader from '@/components/misc/Loader.vue'
import Blockchain from '@/js/Blockchain'
import Metadata from '@/components/Blockchain/Metadata.vue'
import RecentTransactions from '@/components/Home/RecentTransactions.vue'

@Component({
    components: {
        Loader,
        Metadata,
        RecentTransactions,
    },
})
export default class BlockchainPage extends Vue {
    loading = true
    blockchain: Blockchain | null = null

    breadcrumbs: any = [
        {
            text: 'Home',
            disabled: false,
            href: '/',
        },
        {
            text: 'Blockchains',
            disabled: false,
            href: '/blockchains',
        },
    ]

    @Watch('subnetsLoaded')
    onSubnetsLoadedChanged() {
        this.getData()
    }

    created() {
        this.getData()
    }

    get blockchainId(): string {
        return this.$route.params.id
    }

    get assetsLoaded() {
        return this.$store.state.assetsLoaded
    }

    get subnetsLoaded() {
        return this.$store.state.Platform.subnetsLoaded
    }

    getData(): void {
        this.loading = false
        const blockchains = this.$store.state.Platform.blockchains
        this.blockchain = blockchains.find(
            (b: Blockchain) => b.id === this.blockchainId
        )
    }
}
</script>

<style scoped lang="scss">
.recent_tx {
    width: 100%;
    margin-top: 30px;
    box-sizing: border-box;
}
</style>
