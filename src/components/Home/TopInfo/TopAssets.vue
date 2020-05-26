<template>
    <div>
        <div class="header">
            <h2>24h Highest Volume Assets</h2>
        </div>
        <div class="asset column_headers">
            <p class="name">Name</p>
            <p class="metric">Txs</p>
        </div>
        <div class="asset" v-for="(asset,i) in assets" :key="asset.id">
            <div class="name"><router-link :to="`/tx/${asset.id}`">{{asset.name}}</router-link> <span class="symbol">{{asset.symbol}}</span></div>
            <p class="metric ava-monospace">{{asset.txCount_day}}</p>
            <!--TODO: normalize asset.volume_day -->
        </div>
    </div>
</template>

<script>
import axios from "@/axios";

export default {
    data() {
        return {
            // assetData: []
        };
    },
    created() {
        let parent = this;
        // axios.get('/x/assets').then(res => {
        //     console.log(res.data);
        //     parent.assets = res.data.assets;
        // });
    },
    computed: {
        assets() {
            let res = this.$store.getters.assetsArray;

            res.sort((a, b) => {
                let valA = a.txCount_day;
                let valB = b.txCount_day;

                if (valA < valB) {
                    return 1;
                }

                if (valA > valB) {
                    return -1;
                }

                return 0;
            });
            return res.slice(0, 5);
        }
    }
};
</script>

<style scoped lang="scss">
@use '../../../main';

.header {
    padding-bottom: 20px;

    h2 {
        margin: 0;
        font-size: 18px;
    }
}

.column_headers {
    font-weight: bold;
}

.asset {
    column-gap: 10px;
    margin-bottom: 8px;
    font-size: 12px;
    display: flex;
    flex-direction: row;
    overflow: auto;

    > * {
        align-self: center;
    }

    p {
        white-space: nowrap;
        padding: 6px 12px;
        border-radius: 2px;
    }

    .name {
        padding-left: 0px;
        flex-grow: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .symbol {
        flex-shrink: 0;
        color: #976cfa;
        background-color: #ebe4fb;
        width: 35px;
        text-align: center;
        margin: 0px 10px;
        padding: 2 6;
        font-size: 8px;
    }

    .metric {
        flex-shrink: 0;
        text-align: right;
        width: 45px;
    }

    .metric-value {
        color: #56c18d;
    }
}

@media only screen and (max-width: main.$mobile_width) {
    .asset {
        column-gap: 3px;
    }
}
</style>
