<template>
    <div class="search_result">
        <p class="symbol">Tx</p>
        <div class="data">
            <p class="id">{{tx.id}}</p>
            <p> ADDRS: {{addresses.length}}</p>
        </div>
        <router-link :to="`/tx/${tx.id}`"></router-link>
    </div>
</template>
<script>
    import {Transaction} from "@/js/Transaction";

    export default {
        data(){
            return{
                tx: null,
                addresses: [],
            }
        },
        props: {
            item: {
                type: Object,
                required: true
            }
        },
        computed: {

        },
        created() {
            this.tx = new Transaction(this.item);
            this.addresses = this.tx.getInputAddresses();
        }
    }
</script>
<style scoped lang="scss">
    .search_result{
        padding: 8px 13px;
        background-color: #fff;
        display: flex;
        position: relative;


        a{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }


        &:hover{
            background-color: #efefef;
        }
    }

    .symbol{
        padding: 10px;
        background-color: #F1F2F3;
        border-radius: 6px;
        font-weight: bold;
    }
    .data{
        width: 100%;
        overflow: auto;
        padding: 4px;
    }

    .id{
        overflow: hidden;
        text-overflow: ellipsis;
        color: #71C5FF;
    }
</style>