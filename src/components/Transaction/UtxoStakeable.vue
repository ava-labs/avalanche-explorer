<template>
    <div v-if="isStakeableout">
        <div v-if="isUnlocked">
            <div class="utxo_label">Vested UTXO</div>
            <div>
                Unlocked since
                {{ date.toLocaleString() }} ({{ (time * 1000) | fromNow }})
            </div>
        </div>
        <div v-else>
            <div class="utxo_label">Vesting UTXO</div>
            <div>
                Output can be spent
                {{ (time * 1000) | fromNow }} ({{ date.toLocaleString() }})
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class UtxoStakeable extends Vue {
    @Prop() isStakeableout!: boolean
    @Prop() time!: number

    get isUnlocked(): boolean {
        const now = new Date().getTime() / 1000
        return this.time < now ? true : false
    }

    get date(): Date {
        return new Date(this.time * 1000)
    }
}
</script>

<style scoped lang="scss"></style>
