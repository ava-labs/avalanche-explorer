<template>
    <div v-if="isStake === true" class="type">
        <fa icon="coins"></fa> UTXO was in Staking Set
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class UtxoStake extends Vue {
    @Prop() isStake!: boolean // UTXO was in the staking UTXO set (inputs/outputs/stakes)
}
</script>

<style scoped lang="scss"></style>
