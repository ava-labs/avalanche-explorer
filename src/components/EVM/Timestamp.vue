<template>
    <p class="date">
        <fa :icon="['far', 'clock']" class="time_icon"></fa>
        <span class="timestamp"
            >{{ date | fromNow }} ({{ date.toLocaleString() }})</span
        >
    </p>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class Timestamp extends Vue {
    @Prop() timestamp!: string

    get date(): Date {
        return new Date(this.timestamp)
    }
}
</script>

<style scoped lang="scss"></style>
