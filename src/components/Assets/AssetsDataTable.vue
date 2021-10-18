<template>
    <div id="assets_data_table">
        <div class="controls">
            <div class="filter_container">
                <div class="filter_input_container">
                    <input
                        v-model="search"
                        class="filter"
                        type="text"
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
            :mobile-breakpoint="0"
        >
            <template #item.symbol="{ item }">
                <p
                    v-if="item.symbol && $vuetify.breakpoint.smAndUp"
                    class="symbol"
                >
                    {{ item.symbol }}
                </p>
                <p
                    v-if="!item.symbol && $vuetify.breakpoint.smAndUp"
                    class="no_symbol"
                ></p>
            </template>
            <template #item.name="{ item }">
                <router-link :to="`/asset/${item.id}`">
                    <div class="logo_name_id">
                        <div class="logo_container">
                            <AssetLogoRenderer
                                v-if="
                                    type(item) === 'Fixed Cap' ||
                                    type(item) === 'Variable Cap'
                                "
                                :asset="item"
                            />
                            <NFTLogoRenderer v-else :asset="item" />
                        </div>
                        <div class="name_id">
                            <span class="name">{{ item | nameOrID }} </span>
                            <span class="collision">{{
                                collisionHash(item)
                            }}</span>
                        </div>
                    </div>
                </router-link>
            </template>
            <template #item.nft="{ item }">
                <p v-if="$vuetify.breakpoint.smAndUp" class="nft">
                    {{ type(item) }}
                </p>
            </template>
            <template #item.currentSupply="{ item }">
                <p v-if="$vuetify.breakpoint.smAndUp" class="supply">
                    {{ item.currentSupply.toLocaleString(item.denomination) }}
                    <span>{{ item.symbol }}</span>
                </p>
            </template>
            <template #item.chainID="{ item }">
                <p v-if="$vuetify.breakpoint.smAndUp" class="chain">
                    {{ item.chainID | blockchain }}
                </p>
            </template>
        </v-data-table>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Asset } from '@/js/Asset'
import { ICollisionMap } from '@/js/IAsset'
import AssetLogoRenderer from '@/components/Assets/AssetLogoRenderer.vue'
import NFTLogoRenderer from '@/components/Assets/NFTLogoRenderer.vue'

@Component({
    components: {
        AssetLogoRenderer,
        NFTLogoRenderer,
    },
})
export default class AssetsDataTable extends Vue {
    search = ''

    @Prop() assets!: Asset[]

    get headers(): any[] {
        return [
            { text: 'Symbol', value: 'symbol', width: 100 },
            { text: 'Name', value: 'name' },
            {
                text: 'Type',
                value: 'nft',
                width: 120,
                sortable: false,
            },
            { text: 'Supply', value: 'currentSupply', width: 250 },
            { text: 'Issuance', value: 'chainID', width: 80, sortable: false },
        ]
    }

    collisionHash(asset: Asset): string | null {
        return this.collisionMap[asset.symbol]
            ? `${asset.id.substring(0, 8)}`
            : null
    }

    get collisionMap(): ICollisionMap {
        return this.$store.state.collisionMap
    }

    type(asset: Asset): string {
        return asset.nft === 1
            ? 'NFT'
            : asset.variableCap === 1
            ? 'Variable Cap'
            : 'Fixed Cap'
    }
}
</script>

<style scoped lang="scss">
#assets_data_table {
    margin-left: 1px;

    a {
        &:hover {
            text-decoration: none;
            > * {
                opacity: 0.7;
                text-decoration: none;
            }
        }
    }
}

.controls {
    flex-direction: row-reverse;
    margin-bottom: 18px;
}

/* FROM ASSET ROW */
.symbol {
    color: $secondary-color;
    background-color: $secondary-color-xlight;
    padding: 6px 12px;
    text-align: center;
    border-radius: 4px;
    min-height: 1em;
    font-weight: 400;
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

.logo_name_id {
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 14px;
    font-weight: 400;
    text-decoration: none;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
}

.name_id {
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
}

.collision {
    padding-left: 8px;
    font-size: 0.75em;
    color: $primary-color-light;

    :hover {
        text-decoration: none !important;
    }
}

.ft {
    font-size: 12px;
    color: $primary-color-light;
}

@include smOnly {
    .v-card__text {
        padding-left: 16px;
        padding-right: 0;
    }
}

@include xsOrSmaller {
    #validator-data-table {
        .v-data-table td,
        .v-data-table th {
            padding: 0 16px;
        }
    }
}
</style>

<style lang="scss">
#assets_data_table {
    .v-application .primary--text {
        color: $primary-color !important;
        caret-color: $primary-color !important;
    }

    .theme--light.v-tabs > .v-tabs-bar--show-arrows {
        background-color: $white !important;
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

@include xsOrSmaller {
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
            color: $gray;
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
#assets_data_table {
    .v-data-table__expand-icon {
        border: none;
        background-color: rgba(255, 255, 255, 0);
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
