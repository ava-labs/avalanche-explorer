<template>
    <div class="io_item">
        <div class="data_row">
            <p class="label" style="flex-grow: 1;">Tx Id</p>
            <router-link :to="`/tx/${input.txID}`">{{input.txID}}</router-link>
        </div>

        <div class="data_row minidata">
            <div>
                <p class="label">Asset</p>
                <p>{{input.assetID.substr(0,3)}}</p>
            </div>
            <div>
                <p class="label">Amount</p>
                <p>{{input.input.amount}}</p>
            </div>
        </div>


    </div>
</template>
<script>
    export default {
        props: {
            input: {
                type: Object,
                required: true,
            }
        }
    }
</script>
<style scoped lang="scss">
    .label{
        font-weight: bold;
        white-space: nowrap;
    }

    .data_row{
        align-items: center;
        display: flex;
        padding: 4px 30px;
    }
    .minidata > div{
        flex-grow: 1;
    }
</style>
