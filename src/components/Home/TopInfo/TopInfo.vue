<template>
    <div class="top_info">
        <transaction-history></transaction-history>
        <NetworkActivity></NetworkActivity>
        <top-assets></top-assets>
    </div>
</template>
<script>
import TopAssets from "@/components/Home/TopInfo/TopAssets";
import NetworkActivity from "@/components/Home/TopInfo/NetworkActivity";
import TransactionHistory from "./TransactionHistory";

export default {
    components: {
        TopAssets,
        NetworkActivity,
        TransactionHistory
    }
};
</script>

<style scoped lang="scss">
@use"../../../main";

.top_info {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    column-gap: 15px;
    padding: 0;
    overflow: auto;
    width: 100%;
    background: transparent;
    overflow: visible;

    > div {
        padding: 30px;
        overflow: auto;
    }

    > div:last-of-type {
        min-height: 256px;
        border: none;
    }
}

@include main.device_l {
    .top_info {
        grid-template-columns: 360px 1fr minmax(0, 30%);
    }
}


@include main.device_s {
    .top_info {
        grid-template-columns: 1fr;
        grid-template-rows: max-content max-content max-content;
        padding: 0;

        > div {
            padding: 30px;
            margin-bottom: 10px;
            border: none;
        }
    }
}

@include main.device_xs {
    .top_info {
        grid-template-columns: 1fr;
        background-color: #f8f8f8;
        
        > div {
            padding: 30px 15px;
            background-color: main.$white;
        }
    }
}

</style>
