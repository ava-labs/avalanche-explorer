<template>
    <div class="home">
        <recent-transactions class="card"></recent-transactions>
    </div>
</template>

<script>
    import api from '@/axios';
    import RecentTransactions from '@/components/Home/RecentTransactions'
    export default {
        name: 'Home',
        components: {
            RecentTransactions
        },
        created() {
            // api.get('/transactions/count').then( (res) => {
            //     console.log(res);
            // })
        }
    }
</script>
<style>
    h4{
        margin: 0;
        padding: 10px 14px;
        border-bottom: 1px solid #d2d2d2;
    }
</style>
<style scoped>
    .home{
        padding: 30px 8vw;
    }


    .card{
        border-radius: 2px;
        border: 1px solid #d2d2d2
    }

</style>
