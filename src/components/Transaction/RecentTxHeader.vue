<template>
    <div class="header">
        <div class="left">
            <h2>{{ heading }}</h2>
            <p class="chain">
                <span class="label">You are viewing transactions for</span>
                <v-tooltip>
                    <template v-slot:activator="{ on }">
                        <span
                            class="tag"
                            v-on="on"
                            v-bind:style="{
                                color: pChain.color,
                                borderColor: pChain.color,
                            }"
                            >{{ pChain.name }}</span
                        >
                    </template>
                    <span></span>
                </v-tooltip>
                <v-tooltip>
                    <template v-slot:activator="{ on }">
                        <span
                            class="tag margin-left"
                            v-on="on"
                            v-bind:style="{
                                color: xChain.color,
                                borderColor: xChain.color,
                            }"
                            >{{ xChain.name }}</span
                        >
                    </template>
                    <span
                        >The X-Chain acts as a decentralized platform for
                        creating and trading smart digital assets. (Think X for
                        eXchanging assets.)</span
                    >
                </v-tooltip>
                <v-tooltip>
                    <template v-slot:activator="{ on }">
                        <span
                            class="tag margin-left"
                            v-on="on"
                            v-bind:style="{
                                color: cChain.color,
                                borderColor: cChain.color,
                            }"
                            >{{ cChain.name }}</span
                        >
                    </template>
                    <span></span>
                </v-tooltip>
            </p>
        </div>
        <div v-if="$vuetify.breakpoint.smAndUp" class="right" bottom>
            <v-btn
                :loading="loading"
                :text="true"
                class="refresh ava_btn"
                @click="updateTx"
            >
                <fa icon="sync"></fa>
                <span class="ava-btn-label">Refresh</span>
            </v-btn>
            <router-link to="/tx" class="view_all"
                >View All Transactions</router-link
            >
        </div>
    </div>
</template>
<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { getTxChainType } from '@/services/transactions'
import { PChainInfo, XChainInfo, CChainInfo } from '@/helper'

@Component({
    components: {},
})
export default class RecentTxHeader extends Vue {
    @Prop() heading!: string
    @Prop() loading!: boolean

    updateTx() {
        this.$emit('update')
    }

    get xChain() {
        return getTxChainType(XChainInfo.id)
    }

    get pChain() {
        return getTxChainType(PChainInfo.id)
    }

    get cChain() {
        return getTxChainType(CChainInfo.id)
    }
}
</script>
<style scoped lang="scss">
.margin-left {
    margin-left: 10px;
}

.refresh {
    margin-left: 16px;
}

.ava-btn-label {
    padding-left: 8px;
}

.header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    h2 {
        padding-bottom: 2px;
    }

    .refresh {
        color: $primary-color;
        text-transform: none;
        border: none;
    }

    .left {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        flex-grow: 1;
    }

    .right {
        flex-grow: 1;
        display: flex;
        flex-direction: row-reverse;
        align-items: flex-end;
    }
}
@include smOnly {
    .header {
        padding-bottom: 0;

        .right {
            display: none;
        }
    }
}

@include xsOnly {
    .header {
        display: flex;
        flex-direction: column;

        .left {
            display: flex;
            width: 100%;
            justify-content: space-between;
            margin-bottom: 5px;
        }

        .right {
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-content: center;
        }
    }
}
</style>
