<template>
    <div class="home">
        <search-bar class="search"></search-bar>
        <div class="tables">
            <recent-transactions class="card"></recent-transactions>
            <assets class="card"></assets>
        </div>

    </div>
</template>

<script>
    import SearchBar from "@/components/SearchBar";
    import api from '@/axios';
    import RecentTransactions from '@/components/Home/RecentTransactions'
    import Assets from "@/components/Home/Assets";
    export default {
        name: 'Home',
        components: {
            SearchBar,
            RecentTransactions,
            Assets
        },
        created() {
            // api.get('/transactions/count').then( (res) => {
            //     console.log(res);
            // })


        }
    }
</script>
<style>
    .home h4{
        margin: 0;
        padding: 10px 14px;
        /*border-bottom: 1px solid #d2d2d2;*/
    }
</style>
<style scoped>
    .home{
        margin: 0px auto;
        height: 100%;
        max-width: 900px;
        padding: 30px 8vw;
        /*display: grid;*/
        /*grid-template-columns: 1fr 1fr;*/
        /*grid-gap: 30px;*/
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .search{
        width: 100%;
    }

    .card{
        /*background-color: #f2f2f2;*/
        /*border-radius: 2px;*/
        /*border: 1px solid #d2d2d2*/
    }

    .tables{
        display: grid;
        width: 100%;
        grid-template-columns: 1fr 240px;
        grid-gap: 30px;
    }
</style>
