<template>
    <div class="detail">
        <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
        <template v-if="loading && !subnetsLoaded">
            <Loader :contentId="blockchainId" :message="'Fetching Blockchain Details'"/>
        </template>
        <template v-else>
            <BlockchainDetailCard :blockchain="blockchain"/>
            <template v-if="blockchain.indexed">                
                <recent-transactions class="card recent_tx"></recent-transactions>
            </template>
        </template>
    </div>
</template>

<script lang="ts">
import "reflect-metadata";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import Loader from "../components/misc/Loader.vue";
import api from "../axios";
import Blockchain from "@/js/Blockchain";
import BlockchainDetailCard from "@/components/Blockchain/BlockchainDetailCard.vue";
import RecentTransactions from "@/components/Home/RecentTransactions.vue";

@Component({
    components: {
        Loader,
        BlockchainDetailCard,
        RecentTransactions
    }
})
export default class BlockchainPage extends Vue {
    loading: boolean = true;
    blockchain: Blockchain | null = null;

    breadcrumbs: any = [
        {
            text: "Home",
            disabled: false,
            href: "/"
        },
        {
            text: "Blockchains",
            disabled: false,
            href: "/blockchains"
        }
    ];

    @Watch("subnetsLoaded")
    onSubnetsLoadedChanged() {
        this.getData();
    }
    
    created() {
        this.getData();
    }

    get blockchainId(): string {
        return this.$route.params.id;
    }

    get assetsLoaded() {
        return this.$store.state.assetsLoaded;
    }

    get subnetsLoaded() {
        return this.$store.state.Platform.subnetsLoaded;
    }

    getData(): void {
        this.loading = false;
        let blockchains = this.$store.state.Platform.blockchains;
        this.blockchain = blockchains.find((b: Blockchain) => b.id === this.blockchainId);
    }
}
</script>

<style scoped lang="scss">
@use "../main";

.recent_tx {
    width: 100%;
    margin-top: 30px;
    box-sizing: border-box;
}
</style>
