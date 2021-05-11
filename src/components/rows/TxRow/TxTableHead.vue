<template>
    <div class="table_headers">
        <p class="header_indent_sm">
            ID
            <Tooltip
                content="Unique character string generated when a transaction is executed"
            />
        </p>
        <p></p>
        <p class="header_indent">
            From
            <Tooltip content="Address of the sender" />
        </p>
        <p class="header_indent">
            To
            <Tooltip content="Address of the receiver" />
        </p>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component } from 'vue-property-decorator'
import Tooltip from '@/components/rows/Tooltip.vue'

@Component({
    components: {
        Tooltip,
    },
})
export default class TxTableHead extends Vue {}
</script>

<style scoped lang="scss"></style>
