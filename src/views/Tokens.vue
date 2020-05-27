<template>
    <div class="tokens">
        <div class="card">
            <div class="header">
                <h2>Tokens</h2>
                <div class="bar">
                    <p class="count">{{Object.keys(tokens).length}} tokens found</p>
                </div>
            </div>
            <div class="token_list">
                <div class="grid_headers token_row">
                    <p>Symbol</p>
                    <p>Name</p>
                    <p>ID</p>
                    <p>Chain</p>
                    <p class="denomination">Denomination</p>
                    <p class="supply">Supply</p>
                </div>
                <token v-for="token in tokens" :key="token.id" class="token_row" :token="token"></token>
            </div>
        </div>
    </div>
</template>
<script>
import Token from "@/components/Tokens/Token";
import axios from "@/axios";
export default {
    components: {
        Token
    },
    data() {
        return {};
    },
    computed: {
        tokens() {
            return this.$store.state.assets;
        }
    }
};
</script>
<style scoped lang="scss">
@use '../main';

.header {
    padding-bottom: 20px;
    margin-bottom: 10px;

    h2 {
        font-size: 18px;
        margin: 0;
    }

    .count {
        padding-top: 5px;
        color: #808080;
        font-size: 12px;
    }
}

.card {
    background-color: #fff;
    border-radius: 6px;
    padding: 15px;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
}

.grid_headers {
    font-weight: bold;
    font-size: 12px;
}

.token_row {
    display: grid;
    grid-template-columns: 60px 200px 90px 90px 90px 1fr;
    padding: 5px 15px;
    border-bottom: 1px solid #e7e7e7;
    column-gap: 10px;

    &:last-of-type {
        border: none;
    }
}

.denomination {
    text-align: center;
}

.supply {
    text-align: right;
}

@media only screen and (max-width: main.$mobile_width) {
    .grid_headers {
        display: none;
    }

    .token_list {
        padding: 5px 0;
    }

    .token_row {
        grid-template-columns: 50px 1fr 1fr;
    }
}
</style>
