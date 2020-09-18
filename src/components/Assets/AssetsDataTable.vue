<template>
    <div id="assets_data_table">
        <div class="controls">
            <div class="filter_container">
                <div class="filter_input_container">
                    <input
                        class="filter"
                        type="text"
                        v-model="search"
                        placeholder="Filter by Asset Name"
                    />
                </div>
            </div>
        </div>
        <v-data-table 
            :items="assets" 
            :headers="headers" 
            :items-per-page="15"
            :search="search"
            multi-sort
        >
            <template #item.symbol="{item}">
                <p v-if="item.symbol && $vuetify.breakpoint.smAndUp" class="symbol">{{item.symbol}}</p>
                <p v-if="!item.symbol && $vuetify.breakpoint.smAndUp" class="no_symbol"></p>
            </template>
            <template #item.name="{item}">
                <router-link class="name_id" :to="`/asset/${item.id}`">
                <div>
                    <span class="name">{{item | nameOrID}} </span>
                    <span class="collision">{{collisionHash(item)}}</span>
                </div>                    
                </router-link>
            </template>
            
            <template #item.volume_day="{item}">
                <p class="volume_day">
                    {{item.volume_day.toLocaleString()}} 
                    <span class="unit" v-if="$vuetify.breakpoint.xs">{{item.symbol}}</span>
                </p>
            </template>
            <template #item.txCount_day="{item}">
                <p class="supply" v-if="$vuetify.breakpoint.smAndUp">{{item.txCount_day.toLocaleString()}}</p>
            </template>

            <template #item.currentSupply="{item}">
                <p class="supply" v-if="$vuetify.breakpoint.smAndUp">{{item.currentSupply.toLocaleString(item.denomination)}} <span>{{item.symbol}}</span></p>
            </template>
            <template #item.chainID="{item}">
                <p class="chain" v-if="$vuetify.breakpoint.smAndUp">{{item.chainID | blockchain}}</p>
            </template>
        </v-data-table>
    </div>
</template>

<script lang="ts">
import "reflect-metadata";
import { Vue, Component, Prop } from "vue-property-decorator";
import { stringToBig, blockchainMap } from "@/helper";
import { Asset } from '@/js/Asset';
import { ICollisionMap } from '@/js/IAsset';

@Component({
    components: {
    },
    filters: {        
        blockchain(val: string): string {
            return blockchainMap(val);
        },
        nameOrID(val: Asset): string {
            return val.name? val.name :val.id;
        }
    },
})
export default class AssetsDataTable extends Vue {
    search: string = '';
    
    @Prop() assets!: Asset[];

    get headers(): any[] {
        return [
            { text: "Symbol", value: "symbol", width: 100},
            { text: "Name", value: "name"},
            { text: "24h Volume", value: "volume_day", width: 250},
            { text: "24h Tx", value:"txCount_day", width: 100},
            { text: "Supply", value:"currentSupply", width: 250},
            { text: "Issuance", value:"chainID", width: 60, sortable: false},
        ];
    }

    collisionHash(asset: Asset): string | null {
        return (this.collisionMap[asset.symbol]) 
            ? `${asset.id.substring(0, 8)}`
            : null;
    }

    get collisionMap(): ICollisionMap {
        return this.$store.state.collisionMap;
    }

}
</script>

<style scoped lang="scss">
@use "../../main";

#assets_data_table {
    margin-left: 1px;
}


.controls {
    flex-direction: row-reverse;
    margin-bottom: 18px;
}

/* FROM ASSET ROW */
.symbol {
    color: main.$secondary-color;
    background-color: main.$secondary-color-xlight;
    padding: 6px 12px;
    text-align: center;
    border-radius: 4px;
    min-height: 1em;
    font-weight: 400; /* 700 */
    width: 40px;
}

.supply {
    span {
        display: inline-block;
        width: 43px;
        opacity: 0.4;
        text-align: left;
        padding-left: 4px;
    }
}

.collision {
    padding-left: 8px;
    font-size: .75em;
    color: main.$primary-color-light;

    :hover {
        text-decoration: none !important;
    }
}

@include main.smOnly {
    .v-card__text {
        padding-left: 16px;
        padding-right: 0;
    }
}

@include main.xsOnly {
    #validator-data-table {
        .v-data-table td,
        .v-data-table th {
            padding: 0 16px;
        }
    }
}
</style>

<style lang="scss">
@use "../../main";

#assets_data_table {

    .v-application .primary--text {
        color: main.$primary-color !important;
        caret-color: main.$primary-color !important;
    }

    .theme--light.v-tabs > .v-tabs-bar--show-arrows {
        background-color: main.$white !important;
    }

    .theme--light.v-tabs-items {
        margin-left: 1px;
    }

    .v-input--selection-controls .v-input__slot > .v-label,
    .v-input--selection-controls .v-radio > .v-label {
        width: 113px;
    }

    .v-data-table td,
    .v-data-table th {
        padding: 0 4px;

        &:first-of-type {
            padding-left: 16px;
        }

        &:last-of-type {
            padding-right: 16px;
        }
    }

    th {
        .v-input--selection-controls {
            padding-top: 0;
        }

        .v-label {
            font-size: 0.75rem;
        }

        .v-messages {
            display: none;
        }
    }
}

.name {
    font-weight: bold;
}

@include main.xsOnly {
    #validator-data-table {
        .v-data-table td,
        .v-data-table th {
            padding: 0 16px;
        }
    }


    /* FROM ASSETROW */
    .asset_row {
        p {
            font-size: 12px;
        }

        .unit {
            padding-left: 3px;
            min-width: 30px;
            display: inline-block;
            text-align: left;
            color: main.$gray;
            opacity: 0.7;
            font-size: 9px;
        }
    }

    .symbol {
        padding: 2px;
    }

    .name_id {
        grid-column: 1/2;
    }

    .supply {
        grid-column: 2/2;
        text-align: right;
    }
}
</style>

<style lang="scss">
@use "../../main";

#assets_data_table {
    
    .v-data-table__expand-icon {
        border: none;
        background-color: rgba(255,255,255,0);
        border-radius: 0;
    }

    .v-data-footer__icons-before > button,
    .v-data-footer__icons-after > button {
        border-width: inherit;
        cursor: pointer;
    }    

    .v-select.v-text-field input {
        border-color: transparent;
    }
}
</style>