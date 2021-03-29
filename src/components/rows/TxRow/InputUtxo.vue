<template>
    <div>
        <div class="from">
            <span v-if="$vuetify.breakpoint.smAndDown" class="label">From</span>
            <router-link
                class="addr monospace"
                :to="`/address/X-${input.address}`"
                >{{ input.displayAddress }}</router-link
            >
        </div>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { DisplayAddress } from '@/js/Transaction'

@Component({
    filters: {},
})
export default class InputUTXO extends Vue {
    @Prop() input!: DisplayAddress[]
}
</script>

<style scoped lang="scss">
</style>
