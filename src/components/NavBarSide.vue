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
            <v-list-item href="https://cchain.explorer.avax.network/">C-Chain Explorer</v-list-item>
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
@use "../main";

.navbar_side {
    margin-top: main.$navbar_height_offset_l;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    min-width: 270px;
    height: calc(100vh - #{main.$navbar_height_offset_l});
    background-color: main.$white;
    border-right: 1px solid main.$gray-light;
}
</style>