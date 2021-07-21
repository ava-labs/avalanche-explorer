<template>
    <div id="validators_meta" class="meta_data">
        <div class="header">
            <h2>Staking Distribution</h2>
            <v-tabs
                class="tabs"
                active-class="tab_active"
                height="32"
                hide-slider
                @change="typeChange"
            >
                <v-tab>Active</v-tab>
                <v-tab>Pending</v-tab>
            </v-tabs>
        </div>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Mixins, Component } from 'vue-property-decorator'
import { PlatformGettersMixin } from '@/store/modules/platform/platform.mixins'

@Component({
    components: {},
})
export default class Metadata extends Mixins(PlatformGettersMixin) {
    toggle = 'active' // active | pending

    typeChange(val: string) {
        this.toggle = val ? 'pending' : 'active'
        this.$emit('toggle', this.toggle)
    }
}
</script>

<style scoped lang="scss">
.meta_data {
    .header {
        display: flex;
        justify-content: space-between;
    }
}

.tabs_container {
    margin-top: 20px;
    display: flex;
    align-content: center;
    justify-content: flex-end;
}

.tabs {
    flex-direction: row-reverse;
    display: inline-block;
    width: max-content;
    flex-grow: 0;
}

.v-tab {
    color: $primary-color !important;
    background-color: transparent;
    font-size: 13px;
    font-weight: 400;
    letter-spacing: 0;
    margin: 0;
    text-transform: none;
}

.tab_active {
    border-bottom: 4px solid $secondary-color;
}

@include smOrSmaller {
    .meta_data {
        margin-bottom: 10px;
        grid-template-columns: none;
        grid-template-rows: max-content max-content max-content;

        .header {
            flex-direction: column;
        }

        > div {
            text-align: left;
            padding: 0;
        }
    }

    .tabs {
        margin-top: 20px;
        width: 100%;
    }

    .v-tab {
        flex-grow: 1;
    }
}
</style>
<style lang="scss">
#validators_meta {
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
