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
@use "../main";

.home {
    margin: 0px auto;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
}

.recent_tx {
    width: 100%;
    margin-top: 15px;
    box-sizing: border-box;
}

.tables {
    display: grid;
    grid-template-columns: 1fr 280px;
    grid-gap: 30px;
}
</style>
