<template>
    <div class="tabs">
        <v-tabs vertical right>
            <v-tab v-for="(s, subnetID) in subnets" :key="s.id">{{subnetID | subnet}}</v-tab>
            <v-tab-item v-for="(s, subnetID) in subnets" :key="s.id" :vertical="true">
                <Content :subnetID="subnetID" :subnet="s"></Content>
            </v-tab-item>
        </v-tabs>
    </div>
</template>

<script>
import { subnetMap } from "@/helper";
import Vue from "vue";
import Content from "@/components/Subnets/Content";

export default {
    components: {
        Content
    },
    filters: {
        subnet(val) {
            return subnetMap(val);
        }
    },
    props: {
        subnets: Object
    }
};
</script>

<style scoped lang="scss">
@use '../../main';

.v-tabs--vertical {
    margin-right: 30px;
    flex-direction: row-reverse;
}

.v-tabs--vertical > .v-tabs-bar .v-tab {
    width: 150px;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 12px;
    justify-content: flex-start;
    min-height: 48px;
    height: 30px;
    text-transform: none;
}

.v-tab {
    font-weight: bold;
    text-transform: none;
    letter-spacing: 0;
}

.v-tab:before {
    background-color: main.$primary-color !important;
}

</style>

<style lang="scss">
@use '../../main';
.v-tabs--vertical > .v-tabs-bar {
    max-width: 200px !important;
    border-left: 1px solid #cecece;
    /* padding-left: 30px; */
}

.v-tabs--vertical > .v-window {
    overflow: scroll !important;
}

.v-card__text {
    padding-left: 0 !important;
}

.v-application .primary--text {
    color: main.$primary-color !important;
    caret-color: main.$primary-color !important;
}
</style>