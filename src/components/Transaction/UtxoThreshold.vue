<template>
    <div v-if="threshold > 1">
        <div class="utxo_label">Multi-Sig</div>
        <div>
            {{ threshold }} signatures out of {{ addresses.length }} addresses
            required to issue transaction
        </div>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class UtxoThreshold extends Vue {
    @Prop() threshold!: number
    @Prop() addresses!: string[]
}
</script>

<style scoped lang="scss"></style>
