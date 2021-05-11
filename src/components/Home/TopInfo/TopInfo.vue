<template>
    <div class="top_info">
        <TransactionHistory />
        <NetworkActivity />
        <TopAssets />
    </div>
</template>
<script>
import TopAssets from '@/components/Home/TopInfo/TopAssets'
import NetworkActivity from '@/components/Home/TopInfo/NetworkActivity'
import TransactionHistory from './TransactionHistory'

export default {
    components: {
        TopAssets,
        NetworkActivity,
        TransactionHistory,
    },
}
</script>

<style scoped lang="scss">
.top_info {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    column-gap: 20px;
    padding: 0;
    width: 100%;
    background: transparent;
    overflow: visible;

    > div {
        padding: 30px;
        overflow: auto;
    }

    > div:last-of-type {
        min-height: 256px;
    }
}

@include lgOnly {
    .top_info {
        grid-template-columns: 1fr 1fr 1fr;
    }
}

@include smOnly {
    .top_info {
        grid-template-columns: 1fr;
        grid-template-rows: max-content max-content max-content;
        padding: 0;

        > div {
            margin-bottom: 15px;
        }

        > div:last-of-type {
            margin-bottom: 0;
        }
    }
}

@include xsOrSmaller {
    .top_info {
        grid-template-columns: 1fr;

        > div {
            padding: 15px 0;
            margin-bottom: 15px;
        }
    }
}
</style>
