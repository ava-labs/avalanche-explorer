<template>
    <div class="detail">
        <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
        <template v-if="txloading">
            <Loader :contentId="txID" :message="'Fetching Transaction Details'"></Loader>
        </template>
        <div v-if="!tx && !txloading" class="card tx_details_error">
            <h2>Transaction Details Not Found</h2>
            <p class="message">A record for this transaction ID was not found in the Avalanche Explorer</p>
            <p class="content_id">
                {{txID}}
                <CopyText :value="`${txID}`" class="copy_but"></CopyText>
            </p>
            <p><a href="https://github.com/ava-labs/ortelius/issues" target="_blank">Submit Issue</a></p>
        </div>
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
    txloading: boolean = false;
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

    @Watch("txID")
    ontxIDChanged(val: string, oldVal: string) {
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

    get txID(): string {
        return this.$route.params.id;
    }

    getData(): void {
        this.txloading = true;
        
        // TODO: support service for multiple chains
        let url = `/x/transactions/${this.txID}`;
        if (this.assetsLoaded) {
            api.get(url).then(res => {
                this.txloading = false;
                if (res.data) {
                    // tx in Ortelius
                    this.tx = new Transaction(res.data);
                }
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

.tx_details_error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;    
    text-align: center;

    h2 {
        font-weight: 400; /* 700 */
        font-size: 36px;
        line-height: 1.25em;
    }

    .message {
        margin: 12px 0 0.5em;
        font-size: 16px;
        color: main.$primary-color;
    }

    .content_id {
        font-size: 16px;
        color: main.$primary-color-light;
    }

    a {
        display: block;
        width: max-content;
        text-decoration: none !important;
        margin-top: 30px;
        transition: opacity 0.3s;
        
        background-color: transparent !important;
        color: main.$secondary-color !important;
        padding: 10px 24px;

        border-radius: 6px;
        font-family: "DM Sans", sans-serif;
        font-weight: 700;
        letter-spacing: .5px;
        text-transform: uppercase!important;
        font-size: 14px;

        &:hover {
            opacity: 0.9;
        }

    }
}
</style>
