<template>
    <div class="top_info">
        <transaction-history></transaction-history>
        <meta-data></meta-data>
        <top-assets></top-assets>
    </div>
</template>
<script>
import TopAssets from "@/components/Home/TopInfo/TopAssets";
import MetaData from "@/components/Home/TopInfo/MetaData";
import TransactionHistory from "./TransactionHistory";

export default {
    components: {
        TopAssets,
        MetaData,
        TransactionHistory
    }
};
</script>

<style scoped lang="scss">
@use"../../../main";

.top_info {
    display: grid;
    grid-template-columns: 33% 33% 33%;
    padding: 30px 0;
    overflow: auto;
    width: 100%;

    > div {
        padding: 0px 45px;
        overflow: auto;
        border-right: 1px solid #c4c4c455;
    }

    > div:last-of-type {
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
            /* border-bottom: 1px solid #c4c4c455; */
        }
    }
}

@include main.device_xs {
    .top_info {
        background-color: #f8f8f8;
        
        > div {
            padding: 30px 15px;
            /* box-shadow: main.$box-shadow; */
            background-color: main.$white;
        }
    }
}

</style>
