<template>
    <div class="table_headers">
        <p></p>
        <p>
            ID
            <Tooltip content="Unique character string generated when a transaction is executed"></Tooltip>
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
import { Vue, Component } from "vue-property-decorator";
import Tooltip from "@/components/rows/Tooltip.vue";

@Component({
    components: {
        Tooltip
    }
})
export default class TxHeader extends Vue {}
</script>

<style scoped lang="scss">
@use '../../../main';

.table_headers {
    display: grid;
    grid-template-columns: 40px .62fr 1.2fr 1.2fr;
    padding-bottom: 7px;
    border-bottom: 1px solid #e7e7e7;

    p {
        padding: 0 10px;
        font-weight: 700;
        font-size: 12px;
    }
}
</style>
