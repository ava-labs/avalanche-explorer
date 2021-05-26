<template>
    <div class="from" :style="{ backgroundColor: background }">
        <div class="addr_container">
            <span v-if="$vuetify.breakpoint.smAndDown" class="label">From</span>
            <AddressLink :address="input.displayAddress" />
        </div>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import AddressLink from '@/components/rows/TxRow/AddressLink.vue'
import { DisplayAddress } from '@/js/Transaction'
import { backgroundColor } from '@/helper'
@Component({
    components: {
        AddressLink,
    },
})
export default class InputUTXO extends Vue {
    @Prop() input!: DisplayAddress

    get background() {
        return backgroundColor(this.input.displayAddress!)
    }
}
</script>
<style scoped lang="scss"></style>
