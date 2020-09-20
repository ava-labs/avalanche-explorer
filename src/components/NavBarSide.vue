<template>
    <div class="navbar_side">
        <v-list dense nav>
            <v-list-item to="/">Home</v-list-item>
            <v-list-item to="/subnets">Subnets</v-list-item>
            <v-list-item to="/validators">Validators</v-list-item>
            <v-list-item to="/blockchains">Blockchains</v-list-item>
            <v-list-item to="/assets">Assets</v-list-item>
            <v-list-item to="/tx">Transactions</v-list-item>
            <!-- <v-list-item to="/addresses">Addresses</v-list-item> -->
            <v-list-item href="https://cchain.explorer.avax.network/">C-Chain</v-list-item>
            <v-list-item to="/resources">Resources</v-list-item>
        </v-list>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component({})
export default class NavbarSide extends Vue {}
</script>

<style scoped lang="scss">


.navbar_side {
    /* margin-top: $navbar_height_offset_xl; */
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    min-width: 200px;
    height: 100%;
    background-color: $white;

    a:hover {
        text-decoration: none !important;
    }
}

.v-list--nav {
    padding: 15px 0;
}

.v-list--nav .v-list-item {
    padding: 0 24px;
    color: $primary-color;
}

.v-list--nav .v-list-item, 
.v-list--nav .v-list-item:before {
    border-radius: 0;
}

.v-list-item--active::before {
    background-color: $primary-color-light !important;
}

.theme--light.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled) {
    color: $primary-color-light !important;
}
</style>
