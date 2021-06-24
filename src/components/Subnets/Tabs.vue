<template>
    <div id="subnet_tabs">
        <v-tabs vertical right>
            <v-tab v-for="(s, subnetID) in subnets" :key="s.id">{{
                subnetID | subnet
            }}</v-tab>
            <v-tab-item
                v-for="(s, subnetID) in subnets"
                :key="s.id"
                :vertical="true"
            >
                <Content :subnet-i-d="subnetID" :subnet="s" />
            </v-tab-item>
        </v-tabs>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import Content from '@/components/Subnets/Content.vue'
import Subnet from '@/js/Subnet'

interface Subnets {
    [key: string]: Subnet
}

@Component({
    components: {
        Content,
    },
})
export default class SubnetTabs extends Vue {
    @Prop() subnets!: Subnets
}
</script>

<style scoped lang="scss">
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
    font-weight: 400;
    text-transform: none;
    letter-spacing: 0;
}

.v-tab:before {
    background-color: $primary-color !important;
}
</style>

<style lang="scss">
#subnet_tabs {
    .v-tabs--vertical > .v-tabs-bar {
        max-width: 200px !important;
        border-left: 1px solid #cecece;
    }

    .v-tabs--vertical > .v-window {
        overflow: hidden !important;
    }

    .v-card__text {
        padding-left: 0 !important;
    }

    .v-tab.v-tab {
        font-family: 'Inter', sans-serif;
        text-transform: uppercase;
        font-weight: 500;
    }
    .v-application .primary--text {
        color: $primary-color !important;
        caret-color: $primary-color !important;
    }

    .v-tabs-slider-wrapper {
        color: $secondary-color;
        caret-color: $secondary-color;
    }
}
</style>
