<template>
    <div class="detail">
        <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
        <Metadata :asset="asset"></Metadata>
        <template v-if="!tx">
            <Loader :contentId="assetID" :message="'Fetching Asset Details'"></Loader>
        </template>
        <template v-else>
            <TransactionDetailCard :tx="tx">Asset Genesis Details</TransactionDetailCard>
        </template>
    </div>
</template>

<script lang="ts">
import "reflect-metadata";
import { Vue, Component, Watch } from "vue-property-decorator";
import Loader from "../components/misc/Loader.vue";
import Metadata from "../components/Asset/Metadata.vue";
import TransactionDetailCard from "../components/TransactionDetailCard.vue";
import { Transaction } from "../js/Transaction";
import { Asset } from "@/js/Asset";
import api from "../axios";

@Component({
    components: {
        Loader,
        Metadata,
        TransactionDetailCard
    }
})
export default class AssetPage extends Vue {
    tx: Transaction | null = null;

    created() {
        this.getData();
    }

    @Watch("txId")
    ontxIdChanged(val: string, oldVal: string) {
        this.getData();
    }

    @Watch("assetsLoaded")
    onAssetsLoaded() {
        this.getData();
    }

    get assetsLoaded() {
        return this.$store.state.assetsLoaded;
    }

    get breadcrumbs(): any[] {
        return [
            {
                text: "Home",
                disabled: false,
                href: "/"
            },
            {
                text: "Assets",
                disabled: false,
                href: "/assets"
            },
            {
                text: `${
                    this.asset
                        ? this.asset.symbol
                            ? this.asset.symbol
                            : this.asset.id
                        : "Asset"
                }`,
                disabled: true,
                href: ""
            }
        ];
    }

    get assetID(): string {
        return this.$route.params.id;
    }

    get asset(): Asset {
        return this.$store.state.assets[this.$route.params.id];
    }

    get txId(): string {
        return this.$route.params.id;
    }

    getData():void  {
        let parent = this;
        let url = `/x/transactions/${this.txId}`;
        if(this.assetsLoaded) { 
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

$symbol_w: 35px;

.symbol {
    margin-left: 20px;
    text-align: center;
    line-height: $symbol_w;
    background-color: #f1f2f3;
    color: #000;
    font-size: 14px;
    font-weight: bold;
    box-sizing: border-box;
    height: $symbol_w;
    width: $symbol_w;
    border-radius: $symbol_w;
}

.asset_genesis {
    margin-top: 30px;
}

@include main.device_xs {
    .asset_genesis {
        margin-top: 10px;
    }   
}
</style>