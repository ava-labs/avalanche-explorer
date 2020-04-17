<template>
    <div class="home">
        <h1>AVA EXPLORER</h1>
        <search-bar class="search"></search-bar>
        <div class="tables">
            <recent-transactions class="card"></recent-transactions>
            <assets class="card"></assets>
        </div>

    </div>
</template>

<script>
    import SearchBar from "@/components/SearchBar";
    import RecentTransactions from '@/components/Home/RecentTransactions'
    import Assets from "@/components/Home/Assets";
    export default {
        name: 'Home',
        components: {
            SearchBar,
            RecentTransactions,
            Assets
        },
    }
</script>
<style lang="scss">
    .home .header{
        margin: 0;
        padding: 10px 14px;
        display: flex;
        align-items: center;

        h4{
            font-weight: lighter;
            margin: 0;
            flex-grow: 1;
        }
        a{
            font-size: 12px;
        }
    }
</style>
<style scoped lang="scss">
    h1{
        font-weight: lighter;
        font-size: 48px;
    }
    .home{
        margin: 0px auto;
        height: 100%;
        max-width: 900px;
        /*padding: 30px 8vw;*/
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
        margin-bottom: 30px;
        background-color: #f4f4f4;

        input{
            color: #222 !important;
        }
    }

    .card{
        /*background-color: #f2f2f2;*/
        /*border-radius: 2px;*/
        /*border: 1px solid #d2d2d2*/
    }

    .tables{
        display: grid;
        width: 100%;
        grid-template-columns: 1fr 280px;
        grid-gap: 30px;
    }
</style>
