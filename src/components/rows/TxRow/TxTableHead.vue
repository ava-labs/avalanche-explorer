<template>
    <div class="table_headers">
        <p class="header_indent_sm">
            ID
            <Tooltip content="Unique identifier for this transaction" />
        </p>
        <p>
            Chain
            <Tooltip content="Blockchain for this transaction" />
        </p>
        <p class="header_indent">
            From
            <Tooltip content="Sender address" />
        </p>
        <p class="header_indent">
            To
            <Tooltip content="Receiver address" />
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
