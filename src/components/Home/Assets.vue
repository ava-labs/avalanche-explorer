<template>
    <div class="recent_tx">
        <div class="header">
            <h4>Assets</h4>
            <router-link to="/assets">View All</router-link>
        </div>
        <div class="list">
            <asset-row v-for="asset in assets" :key="asset.id" :asset="asset"></asset-row>
        </div>
    </div>
</template>
<script>
    import AssetRow from "@/components/Home/AssetRow";
    import api from "../../axios";
    export default {
        components: {
            AssetRow
        },
        data(){
            return{
                assets: [],
            }
        },
        created() {

            let parent = this;
            let url = `/x/assets`;
            api.get(url).then((res) => {
                const data = res.data;
                parent.assets = data;
                // console.log(res);
            });
        }
    }
</script>
<style scoped lang="scss">

</style>