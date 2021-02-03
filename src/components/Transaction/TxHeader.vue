<template>
    <div class="tx_chain_header">
        <h2>Transactions</h2>
        <p v-if="$vuetify.breakpoint.smAndUp" class="chain right" bottom>
            <span class="label">You are viewing transactions for</span>
            <v-tooltip>
                <template v-slot:activator="{ on }">
                    <span class="tag" v-on="on">X-Chain</span>
                </template>
                <span
                    >The X-Chain acts as a decentralized platform for creating
                    and trading smart digital assets. (Think X for eXchanging
                    assets.)</span
                >
            </v-tooltip>
        </p>
    </div>
</template>
<script lang="ts">
import 'reflect-metadata'
import { Vue, Component } from 'vue-property-decorator'

@Component({
    components: {},
})
export default class TxHeader extends Vue {}
</script>
<style scoped lang="scss"></style>
