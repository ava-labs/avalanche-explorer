<template>
    <div v-if="time !== 0">
        <div class="utxo_label">Lock Time</div>
        <div v-if="isBeforeNow === true">
            Unlocked since
            {{ date.toLocaleString() }} ({{ (time * 1000) | fromNow }})
        </div>
        <div v-else>
            Output can be spent {{ time | toNow }} ({{ date.toLocaleString() }})
        </div>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class UtxoLockTime extends Vue {
    @Prop() time!: number

    get isBeforeNow(): boolean {
        const now = new Date().getTime() / 1000
        return this.time < now ? true : false
    }

    get date(): Date {
        return new Date(this.time * 1000)
    }
}
</script>

<style scoped lang="scss"></style>
