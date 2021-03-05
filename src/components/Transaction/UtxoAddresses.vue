<template>
    <div>
        <div class="utxo_label">From</div>
        <div>
            <!-- CONDITIONAL FOR C-CHAIN -->
            <router-link
                v-for="({ address, displayAddress }, i) in addresses"
                :key="i"
                :to="`/address/X-${address}`"
                class="address monospace"
                >{{ displayAddress }}</router-link
            >
        </div>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class UtxoAddresses extends Vue {
    @Prop() addresses!: string[]
}
</script>

<style scoped lang="scss"></style>
