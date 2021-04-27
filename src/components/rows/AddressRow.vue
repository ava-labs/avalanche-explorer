<template>
    <div class="address_row">
        <p class="symbol">#</p>
        <div class="center_info">
            <div>
                <p class="label">Type</p>
                <p>Address</p>
            </div>
            <div>
                <p class="label">Balance</p>
                <p>{{ balance }}</p>
            </div>
            <div>
                <p class="label"># of Transactions</p>
                <p>{{ txCount }}</p>
            </div>
            <div>
                <p class="label">Lifetime Value</p>
                <p>{{ lifetimeValue }}</p>
            </div>
        </div>

        <router-link :to="url" class="link">View Address</router-link>
    </div>
</template>
<script>
export default {
    props: {
        address: {
            type: Object,
            required: true,
        },
    },
    computed: {
        txCount() {
            return this.address.data.transactionCount
        },
        balance() {
            return this.address.data.balance
        },
        lifetimeValue() {
            return this.address.data.lifetimeValue
        },
        url() {
            return `/`
        },
    },
}
</script>
<style scoped lang="scss">
.address_row {
    display: flex;
    align-items: center;
}
$symbol_w: 35px;
.symbol {
    text-align: center;
    line-height: $symbol_w;
    background-color: #f1f2f3;
    color: #000;
    font-size: 14px;
    font-weight: 400;
    box-sizing: border-box;
    height: $symbol_w;
    width: $symbol_w;
    border-radius: $symbol_w;
}

.link {
    text-decoration: none;
    text-transform: capitalize;
}

.center_info {
    display: flex;
    flex-grow: 1;

    > div {
        /*flex-grow: 1;*/
        text-align: center;
        padding-left: 30px;
    }

    .label {
        font-size: 12px;
        opacity: 0.7;
        font-weight: lighter;
        margin-bottom: 6px;
    }
}
</style>
