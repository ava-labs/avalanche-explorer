<template>
    <div id="blockchain_data_table">
        <v-card-title v-if="title">
            {{title}}
            <v-spacer></v-spacer>
        </v-card-title>
        <v-data-table :items="blockchains" :headers="headers" multi-sort>
            <template #item.name="{item}">
                <div>
                    <img class="table_image" src="@/assets/blockchain-purple.png" alt />
                    <template v-if="links">
                        <router-link :to="`/blockchain/${item.id}`" class="id">{{ item.name }}</router-link>
                    </template>
                    <template v-else>{{ item.name }}</template>
                </div>
            </template>
            <template #item.vmID="{item}">
                <div>
                    <a :href="vmDocumentation(item.vmID)">{{ vm(item.vmID) }}</a>
                </div>
            </template>
            <template #item.indexed="{item}">
                <Indexed :indexed="item.indexed" v-bind:notIndexedLabel="false"></Indexed>
            </template>
            <template #item.subnetID="{item}">
                <div>
                    <router-link :to="`/subnet/${item.subnetID}`">{{ item.subnetID | subnet }}</router-link>
                </div>
            </template>
        </v-data-table>
    </div>
</template>

<script lang="ts">
import "reflect-metadata";
import { Vue, Component, Prop } from "vue-property-decorator";
import { subnetMap, VMMap, VMDocumentationMap } from "@/helper";
import Subnet from "@/js/Subnet";
import Blockchain from "@/js/Blockchain";
import Indexed from "@/components/Blockchain/Indexed.vue";

@Component({
    components: {
        Indexed
    },
    filters: {
        subnet(val: string): string {
            return subnetMap(val);
        }
    }
})
export default class BlockchainDataTable extends Vue {
    @Prop() blockchains!: Blockchain[];
    @Prop() links?: boolean;
    @Prop() subnets?: boolean;
    @Prop() title?: string;

    get headers(): any[] {
        let headers = [
            { text: "Name", value: "name" },
            { text: "Virtual Machine", value: "vmID" },
            { text: "Database Index", value: "indexed", width: 125 },
            { text: "Subnet", value: "subnetID" },
        ];
        return this.subnets ? headers : headers.slice(0, 3);
    }

    subnet(val: string) {
        return subnetMap(val);
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

#blockchain_data_table {
    .v-data-footer__icons-before > button,
    .v-data-footer__icons-after > button {
        border-width: inherit;
        cursor: pointer;
    }    

    .v-select.v-text-field input {
        border-color: transparent;
    }

    .hide {
        display: none;
    }
}
</style>