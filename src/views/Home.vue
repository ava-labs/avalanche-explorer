<template>
    <div class="home">
        <top-info></top-info>
        <recent-transactions class="card recent_tx"></recent-transactions>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import TopInfo from '@/components/Home/TopInfo/TopInfo.vue'
import RecentTransactions from '@/components/Home/RecentTransactions.vue'

@Component({
    components: {
        TopInfo,
        RecentTransactions,
    },
})
export default class Home extends Vue {}
</script>

<style scoped lang="scss">
.home {
    margin: 0px auto;
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

@include xsOnly {
    .recent_tx {
        margin-top: 0;
    }
}
</style>
