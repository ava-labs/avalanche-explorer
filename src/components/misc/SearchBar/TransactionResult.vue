<template>
    <div class="search_result" @click="select">
        <p class="symbol">Tx</p>
        <div class="data">
            <p class="id">{{tx.id}}</p>
            <p class="ago">{{tx.data.timestamp | date}}</p>
        </div>
<!--        <router-link :to="`/tx/${tx.id}`"></router-link>-->
    </div>
</template>
<script>
    import {Transaction} from "@/js/Transaction";
    import moment from "moment";

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
        filters: {
            date(val){
                let date = new Date(val);
                return moment(date).fromNow();
            }
        },
        methods: {
            select(){
                let url = `/tx/${this.tx.id}`;
                this.$router.push(url);
                this.$emit('select');
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

    $symbol_W: 20px;
    .symbol{
        padding: 10px;
        background-color: #F1F2F3;
        border-radius: 6px;
        font-weight: bold;
        height: $symbol_W;
        width: $symbol_W;
        text-align: center;
        line-height: $symbol_W;
    }
    .data{
        width: 100%;
        overflow: auto;
        padding: 4px 10px;
    }

    .ago{
        margin-top: 4px;
        opacity: 0.7;
    }

    .id{
        overflow: hidden;
        text-overflow: ellipsis;
        color: #71C5FF;
    }
</style>
