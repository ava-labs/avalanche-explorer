<template>
    <div class="home">
        <RecentTransactions class="card recent_tx" />
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import RecentTransactions from '@/components/Home/RecentTransactions.vue'

@Component({
    components: {
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
    border: none !important;
}

@if $VUE_APP_DEFAULT_NETWORKID == 5 {
    .recent_tx {
        border: 2px solid $secondary-color !important;
    }
}

.tables {
    display: grid;
    grid-template-columns: 1fr 280px;
    grid-gap: 30px;
}

@include xsOrSmaller {
    .recent_tx {
        margin-top: 0;
    }
}
</style>
