<template>
    <div class="detail">
        <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
        <template v-if="!tx">
            <Loader :contentId="txId" :message="'Fetching Transaction Details'"></Loader>
        </template>
        <template v-else>
            <TransactionDetailCard :tx="tx">Transaction Details</TransactionDetailCard>
        </template>
    </div>
</template>

<script lang="ts">
import "reflect-metadata";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import Loader from "../components/misc/Loader.vue";
import TransactionDetailCard from "../components/TransactionDetailCard.vue";
import { Transaction } from "../js/Transaction";
import api from "../axios";

@Component({
    components: {
        Loader,
        TransactionDetailCard
    }
})
export default class TransactionPage extends Vue {
    tx: Transaction | null = null;
    breadcrumbs: any = [
        {
            text: "Home",
            disabled: false,
            href: "/"
        },
        {
            text: "Transaction",
            disabled: true,
            href: ""
        }
    ];

    @Watch("txId")
    ontxIdChanged(val: string, oldVal: string) {
        this.getData();
    }

    @Watch("assetsLoaded")
    onAssetsLoaded() {
        this.getData();
    }
    
    created() {
        this.getData();
    }

    get assetsLoaded() {
        return this.$store.state.assetsLoaded;
    }

    get txId(): string {
        return this.$route.params.id;
    }

    getData(): void {
        let parent = this;
        // TODO: support service for multiple chains
        let url = `/x/transactions/${this.txId}`;
        if (this.assetsLoaded) {
            api.get(url)
            .then(res => {
                const data = res.data;
                // console.log(data);
                let tx = new Transaction(data);
                parent.tx = tx;
                // console.log(tx);
            })
            .catch(err => {
                console.log(err);
            });
        }
    }
}
</script>

<style scoped lang="scss">
@use "../main";
</style>
