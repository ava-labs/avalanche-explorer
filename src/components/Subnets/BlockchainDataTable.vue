<template>
    <v-card id="blockchains-table">
        <v-card-title>
            {{title}}
            <v-spacer></v-spacer>
        </v-card-title>
        <v-data-table :items="blockchains" :headers="headers" multi-sort>
            <template #item.name="{item}">
                <div>
                    <img class="table_image" src="@/assets/blockchain-purple.png" alt />
                    {{ item.name }}
                </div>
            </template>
            <template #item.vmID="{item}">
                <div>
                    <a :href="vmDocumentation(item.vmID)">{{ vm(item.vmID) }}</a>
                    <div class="id_overflow">{{ item.vmID }}</div>
                </div>
            </template>
            <template #item.indexed="{item}">
                <div class="id_overflow">
                    <p class="icon" v-show="item.indexed" style="color: #56c18d">
                        <fa icon="check-circle"></fa> 
                        <span>Indexed</span>
                    </p>
                    <p class="icon" v-show="!item.indexed">
                        <fa icon="check" class="not-indexed"></fa>
                    </p>
                </div>
            </template>
        </v-data-table>
    </v-card>
</template>

<script lang="ts">
import "reflect-metadata";
import { Vue, Component, Prop } from "vue-property-decorator";
import { VMMap, VMDocumentationMap } from "@/helper";
import Subnet from "@/js/Subnet";
import { AVALANCHE_SUBNET_ID } from "@/store/modules/platform/platform";
import Blockchain from "@/js/Blockchain";

@Component({})
export default class BlockchainDataTable extends Vue {
    defaultSubnetID: string = AVALANCHE_SUBNET_ID;

    @Prop() subnetID!: string;
    @Prop() subnet!: Subnet;
    @Prop() blockchains!: Blockchain[];
    @Prop() title!: string;

    get headers(): any[] {
        return [
            { text: "Name", value: "name" },
            { text: "Virtual Machine", value: "vmID" },
            { text: "Database Index", value: "indexed", width: 125 },
        ];
    }

    vm(val: string) {
        return VMMap(val);
    }

    vmDocumentation(val: string) {
        return VMDocumentationMap(val);
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
    /* max-width: 100px; */
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 300;
    font-size: 0.825em;
    color: main.$gray;
    line-height: 1em;
}

.icon {
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    span {
        font-size: 0.875rem;
        margin-left: 6px;
        font-weight: 700;
    }
}

.not-indexed {
    opacity: 0.4;
    font-size: 0.8rem;
    margin-left: 4px;
}

@include main.device_s {
}

@include main.device_xs {
}
</style>

<style lang="scss">
@use "../../main";
</style>