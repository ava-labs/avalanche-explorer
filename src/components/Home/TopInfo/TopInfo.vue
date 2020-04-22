<template>
    <div class="top_info">
        <div>
            <h4>Highest Volume Assets (Past 24Hr)</h4>
            <div class="asset" v-for="(asset,i) in assets" :key="asset.id">
                <p class="name">{{i+1}}. {{asset.name}}</p>
                <p class="chain">{{asset.chainID}}</p>
                <p class="change">+ 21.4%</p>
            </div>
        </div>
        <meta-data></meta-data>
        <transaction-history></transaction-history>
    </div>
</template>
<script>
    import axios from "@/axios";
    import TransactionHistory from './TransactionHistory';
    import MetaData from "@/components/Home/TopInfo/MetaData";

    export default {
        components: {
            MetaData,
            TransactionHistory
        },
        data(){
            return{
                assets: [],
                txCountDay: 56000,
            }
        },
        created() {
            let parent = this;
            axios.get('/x/assets').then(res => {
                console.log(res.data);
               parent.assets = res.data;
            });
        }
    }
</script>
<style>
    .top_info  h4{
        margin: 0;
        margin-bottom: 20px;
        font-size: 12px;
    }
</style>
<style scoped lang="scss">
    .top_info{
        display: grid;
        grid-template-columns: 1fr 1fr max-content;
        padding: 25px 0px;


        > div{
            padding: 0px 35px;
            border-right: 1px solid #C4C4C455;
        }

        > div:last-of-type{
            border: none;
        }
    }


    h4{
        margin: 0;
        margin-bottom: 20px;
        font-size: 12px;
    }


    .asset{
        display: grid;
        column-gap: 10px;
        grid-template-columns: 1fr 90px 70px;
        margin-bottom: 8px;
        font-size: 12px;

        p{
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            padding: 6px 12px;
            border-radius: 2px;
        }

        .name{
            padding-left: 0px;
        }
        .chain{
            background-color: #EBE4FB;
            color: #976CFA;
            text-align: center;
        }

        .change{
            background-color: #E4FBEF;
            color: #56C18D;
            text-align: center;
        }
    }










</style>
