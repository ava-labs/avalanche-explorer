<template>
    <div class="table_headers">
        <p></p>
        <p>
            ID
            <Tooltip
                content="Unique character string generated when a transaction is executed"
            ></Tooltip>
        </p>
        <p>
            From
            <Tooltip content="Address of the sender"></Tooltip>
        </p>
        <p>
            To
            <Tooltip content="Address of the receiver"></Tooltip>
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

<style scoped lang="scss">
.table_headers {
    display: grid;
    grid-template-columns: 40px 0.62fr 0.9fr 1.5fr;
    padding-bottom: 7px;
    border-bottom: 1px solid #e7e7e7;

    p {
        padding: 0 10px;
        font-weight: 700;
        font-size: 12px;
    }
}

@include xsOnly {
    .table_headers {
        display: none;
    }
}
</style>
