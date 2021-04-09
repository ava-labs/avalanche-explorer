<template>
    <section v-if="blockchain" class="card meta">
        <header class="header">
            <h2>{{ blockchain.name }} Details</h2>
        </header>
        <article class="meta_row">
            <p class="label">Name</p>
            <p class="blockchain">
                <span>{{ blockchain.name }}</span>
            </p>
        </article>
        <article class="meta_row">
            <p class="label">ID</p>
            <p class="blockchain">
                <span>{{ blockchain.id }}</span>
            </p>
        </article>
        <article class="meta_row">
            <p class="label">Subnet</p>
            <p class="blockchain">
                <span>{{ blockchain.subnetID }}</span>
            </p>
        </article>
        <article class="meta_row">
            <p class="label">Validators</p>
            <p class="blockchain">
                <span>{{ validatorsCount }}</span>
            </p>
        </article>
        <article class="meta_row">
            <p class="label">VM ID</p>
            <p class="blockchain">
                <span>{{ blockchain.vmID }}</span>
            </p>
        </article>
        <article class="meta_row">
            <p class="label">Indexed</p>
            <p class="blockchain">
                <Indexed
                    :indexed="blockchain.indexed"
                    :not-indexed-label="true"
                />
            </p>
        </article>
    </section>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import Blockchain from '@/js/Blockchain'
import Indexed from '@/components/Blockchain/Indexed.vue'

@Component({
    components: {
        Indexed,
    },
})
export default class Metadata extends Vue {
    @Prop() blockchain!: Blockchain

    get validatorsCount() {
        return this.$store.state.Platform.subnets[this.blockchain.subnetID]
            .validators.length
    }
}
</script>

<style scoped lang="scss">
/* ==========================================
   details
   ========================================== */

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

/* ==========================================
   transactions
   ========================================== */

.bar {
    display: flex;
    align-items: center;
    > p {
        flex-grow: 1;
    }
}

.transactions {
    overflow: auto;
    margin-top: 30px;

    .table_headers {
        display: grid;
        grid-template-columns: 35px 120px 1fr 1fr;
        padding-bottom: 7px;
        border-bottom: 1px solid #e7e7e7;

        p {
            padding: 0px 10px;
            font-weight: 400; /* 700 */
            font-size: 12px;
        }
    }

    .tx_rows {
        width: 100%;
        border-radius: 2px;
        margin: 2px 0;
        box-sizing: border-box;
        border-bottom: 1px solid #e7e7e7;
    }

    .tx_table {
        font-size: 12px;
    }
}

.bar-table {
    padding-top: 30px;
    display: flex;
    justify-content: flex-end;
}

@include smOnly {
    .bar {
        flex-direction: column;
        align-items: stretch;

        .pagination-container {
            padding-top: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }

    .bar-table {
        justify-content: center;
    }

    .transactions {
        .table_headers {
            display: none;
        }
    }
}
</style>
