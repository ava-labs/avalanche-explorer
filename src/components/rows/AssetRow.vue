<template>
    <div :key="asset.id" class="asset_row">
        <div class="avatar">
            <p>{{ asset.symbol }}</p>
        </div>
        <p class="id">{{ asset.id }}</p>
        <div>
            <p class="symbol">{{ asset.symbol }}</p>
            <p class="name">{{ asset.name }}</p>
        </div>
        <p class="chain">{{ asset.chainID }}</p>
        <p class="denomination">{{ asset.denomination }}</p>
        <p class="supply">{{ asset.currentSupply }}</p>
    </div>
</template>
<script>
export default {
    props: {
        asset: {
            type: Object,
            required: true,
        },
    },
}
</script>
<style scoped lang="scss">
.avatar {
    width: 35px;
    height: 35px;
    border-radius: 35px;
    line-height: 35px;
    text-align: center;
    background-color: #f1f2f3;

    p {
        width: 100%;
        font-weight: 400;
        color: #272727;
    }
}

.asset_row {
    display: grid;
    grid-template-columns: max-content 70px 1fr 90px 1fr 1fr;
    padding: 15px 15px;
    border-bottom: 1px solid #e7e7e7;

    > * {
        align-self: center;
    }

    > div {
        display: flex;
    }

    p {
        overflow: hidden;
        font-size: 13px;
        text-overflow: ellipsis;
    }
}
</style>
