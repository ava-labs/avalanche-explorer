<template>
    <div>
        <h4>Highest Volume Assets (Past 24Hr)</h4>
        <div class="asset" v-for="(asset,i) in assets" :key="asset.id">
            <p>{{i+1}}.</p>
<!--            <p class="name">{{asset.name}}</p>-->
            <router-link :to="`/tx/${asset.id}`" class="name">{{asset.name}}</router-link>
            <p class="chain">{{asset.symbol}}</p>
<!--            <p class="chain">{{asset.volume_day}} Txs</p>-->
            <p class="change">{{asset.txCount_day}} Tx</p>
        </div>
    </div>
</template>

<script>
    import axios from "@/axios";

    export default {
        data(){
            return {
                // assetData: []
            }
        },
        created() {
            let parent = this;
            // axios.get('/x/assets').then(res => {
            //     console.log(res.data);
            //     parent.assets = res.data.assets;
            // });
        },
        computed:{
            assets(){
                let res = this.$store.getters.assetsArray;

                res.sort((a,b) => {
                    let valA = a.txCount_day;
                    let valB = b.txCount_day;

                    if(valA < valB){
                        return 1;
                    }

                    if(valA > valB){
                        return -1;
                    }

                    return 0;
                });
                return res.slice(0,5);
            }
        }
    }
</script>
<style scoped lang="scss">
    @use '../../../main';

    .asset{
        display: grid;
        column-gap: 10px;
        grid-template-columns: max-content 1fr 60px 70px;
        margin-bottom: 8px;
        font-size: 12px;
        display: flex;
        flex-direction: row;
        /*flex-wrap: wrap;*/

        > * {
            align-self: center;
        }

        p{
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            padding: 6px 12px;
            border-radius: 2px;
        }

        .name{
            padding-left: 0px;
            flex-grow: 1;
        }
        .chain{
            background-color: #EBE4FB;
            color: #976CFA;
            text-align: center;
            width: 35px;
            padding: inherit 0px;
            margin: 0px 10px;
        }

        .change{
            background-color: #E4FBEF;
            color: #56C18D;
            text-align: center;
            width: 45px;
        }
    }


    @media only screen and (max-width: main.$mobile_width) {
        .asset{
            column-gap: 3px;
        }
    }



</style>
