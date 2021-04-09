<template>
    <div class="from">
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
import { Input } from '@/store/modules/transactions'

@Component({
    components: {
        AddressLink,
    },
})
export default class InputUTXO extends Vue {
    @Prop() input!: Input
}
</script>
<style scoped lang="scss"></style>
