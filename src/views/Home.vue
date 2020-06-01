<template>
    <div class="home">
        <top-info class="card"></top-info>
        <recent-transactions class="card recent_tx"></recent-transactions>
    </div>
</template>

<script>
import TopInfo from "@/components/Home/TopInfo/TopInfo";
import RecentTransactions from "@/components/Home/RecentTransactions";

export default {
    name: "Home",
    components: {
        TopInfo,
        RecentTransactions
    }
};
</script>

<style scoped lang="scss">
@use '../main';

h1 {
    font-weight: lighter;
    font-size: 48px;
}

.home {
    margin: 0px auto;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
}

.card {
    background-color: #fff;
    width: 100%;
    border-radius: 6px;
    margin-top: 15px;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
}

.recent_tx {
    width: 100%;
}

.tables {
    display: grid;
    grid-template-columns: 1fr 280px;
    grid-gap: 30px;
}
</style>
