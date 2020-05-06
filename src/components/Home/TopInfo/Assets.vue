<template>
    <div>
        <h4>Highest Volume Assets (Past 24Hr)</h4>
        <div class="asset" v-for="(asset,i) in assets" :key="asset.id">
            <p class="name">{{i+1}}. {{asset.name}}</p>
            <p class="chain">{{asset.chainID}}</p>
            <p class="change">+ 21.4%</p>
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


    @media only screen and (max-width: main.$mobile_width) {
        .asset{
            column-gap: 3px;
        }
    }
</style>
