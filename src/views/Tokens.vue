<template>
    <div class="tokens">
        <div class="card">
            <div class="header">
                <v-tooltip bottom left>
                    <template v-slot:activator="{ on }">
                        <h2 v-on="on">Tokens</h2>
                    </template>
                    <span>
                        A smart digital asset is a digital representation of a real-world thing such as an equity, bond, money etc.
                        <br />They can have a complex ruleset that defines their behavior and how they are handled.
                        <br />This ruleset can include things like, “can’t be traded until next year,” for example.
                    </span>
                </v-tooltip>
                <div class="bar">
                    <p class="count">{{Object.keys(tokens).length}} tokens found</p>
                </div>
            </div>
            <div class="token_list">
                <div class="grid_headers token_row">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <p v-on="on">Symbol</p>
                        </template>
                        <span>Shorthand ticker symbol of the asset.<br>
                        Between 0 and 4 characters. Not necessarily unique.</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <p v-on="on">Name</p>
                        </template>
                        <span>Human-readable name for the asset. Not necessarily unique.</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <p v-on="on">Genesis Tx ID</p>
                        </template>
                        <span>A transaction queries or modifies the state of a blockchain.</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <p v-on="on">Chain</p>
                        </template>
                        <span>The blockchain on which this token was minted.</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <p v-on="on" class="denomination">Denomination</p>
                        </template>
                        <span>Determines how balances of this asset are displayed by user interfaces</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <p v-on="on" class="supply">Supply</p>
                        </template>
                        <span>Units of the asset that have been created</span>
                    </v-tooltip>
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

    .count {
        padding-top: 5px;
        color: #808080;
        font-size: 12px;
    }
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

@include main.sm-device {
    .grid_headers {
        display: none;
    }

    .token_list {
        padding: 5px 0;
    }

    .token_row {
        grid-template-columns: 50px 1fr 1fr;
        padding: 10px 0 5px;
    }
}
</style>
