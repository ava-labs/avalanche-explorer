<template>
    <v-card id="addresses-table">
        <v-card-title v-if="title">
            {{title}}
            <v-spacer></v-spacer>
        </v-card-title>
        <v-data-table :items="addresses" :headers="headers" multi-sort>
            <template #item.address="{item}">
                <div>
                    <img class="table_image" src="@/assets/blockchain-purple.png" alt />
                    <template v-if="links">
                        <router-link :to="`/address/${item.address}`" class="id">{{ item.address }}</router-link>
                    </template>
                    <template v-else>{{ item.address }}</template>
                </div>
            </template>
        </v-data-table>
    </v-card>
</template>

<script lang="ts">
import "reflect-metadata";
import { Vue, Component, Prop } from "vue-property-decorator";
import { VMMap, VMDocumentationMap } from "@/helper";
import { IAddress } from '@/js/IAddress';

@Component({
    components: {
    }
})
export default class AddressDataTable extends Vue {
    @Prop() addresses!: IAddress[];
    @Prop() links?: boolean;
    @Prop() title?: string;

    get headers(): any[] {
        return [
            { text: "Address", value: "address" },
            { text: "AVAX Balance", value: "avaxBalance" },
            // { text: "Database Index", value: "indexed", width: 125 },
        ];
    }
}
</script>

<style scoped lang="scss">
@use "../../main";

.table_image {
    height: 20px;
    display: inline-block;
    margin-top: -4px;
    margin-right: 8px;
    vertical-align: middle;
}

.id_overflow {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 300;
    font-size: 0.825em;
    color: main.$gray;
    line-height: 1em;
}

@include main.device_s {
}

@include main.device_xs {
}
</style>

<style lang="scss">
@use "../../main";
</style>