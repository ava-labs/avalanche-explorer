<template>
    <div id="subnets">
        <template v-if="loading">
            <Loader :message="'Fetching Subnets'"></Loader>
        </template>
        <template v-else>
            <Metadata
                :totalSubnets="totalSubnets"
                :totalValidators="totalValidators"
                :totalBlockchains="totalBlockchains"
                :totalStake="totalStake"
            ></Metadata>
            <div class="card" v-if="this.$vuetify.breakpoint.mdAndUp">
                <Tabs :subnets="subnets"></Tabs>
            </div>
            <div class="card selection" v-if="this.$vuetify.breakpoint.smAndDown">
                <v-select v-model="selection" :items="subnetsByName" label="Select Subnet" outlined></v-select>
                <Content :subnetID="selection" :subnet="subnets[selection]"></Content>
            </div>
        </template>
    </div>
</template>

<script lang="ts">
import "reflect-metadata";
import { Vue, Component } from "vue-property-decorator";
import { avalanche } from "@/avalanche";
import { subnetMap } from "@/helper";
import Metadata from "../components/Subnets/Metadata.vue";
import Tabs from "../components/Subnets/Tabs.vue";
import Loader from "../components/misc/Loader.vue";
import Content from "@/components/Subnets/Content.vue";
import { AVALANCHE_SUBNET_ID } from "@/store/modules/platform/platform";
import Blockchain from '@/js/Blockchain';
import { IPlatformState } from '../store/modules/platform/IPlatformState';

@Component({
    components: {
        Loader,
        Metadata,
        Content,
        Tabs
    },
    filters: {
        subnet(val: string) {
            return subnetMap(val);
        }
    }
})
export default class Subnets extends Vue {
    selection: string = AVALANCHE_SUBNET_ID;
    loading: boolean = true;
    blockchains: Blockchain[] = [];

    async created() {
        this.blockchains = await this.getBlockchains();
    }

    async getBlockchains() {
        //@ts-ignore
        return await avalanche.apis.platform
            //@ts-ignore
            .getBlockchains()
            .then((res: any) => {
                this.loading = false;
                return res;
            })
            .catch((error: any) => console.log(error));
    }

    get subnets() {
        const subnets = this.$store.state.Platform.subnets;
        const ordered: IPlatformState["subnets"] = {};
        Object.keys(subnets)
            .sort()
            .forEach(key => (ordered[key] = subnets[key]));
        return ordered;
    }
    
    get totalValidators() {
        return this.$store.getters["Platform/totalValidators"];
    }
    
    get totalBlockchains() {
        return this.$store.getters["Platform/totalBlockchains"];
    }
    
    get totalStake() {
        let valBig = this.$store.getters["Platform/totalStake"];
        let res = valBig.div(Math.pow(10, 9));
        return res;
    }
    
    get totalSubnets() {
        return Object.keys(this.$store.state.Platform.subnets).length;
    }
    
    get subnetsByName() {
        interface IMap {
            text: string,
            value: string
        }
        let list: IMap[] = [];
        Object.keys(this.subnets).forEach(key => {
            let object: IMap = {
                text: subnetMap(key) ? subnetMap(key) : key,
                value: key
            };
            list.push(object);
        });
        return list;
    }
}
</script>

<style scoped lang="scss">
@use "../main";

.headers {
    display: grid;
    grid-template-columns: 70px 1fr 1fr 1fr;
    font-size: 12px;
    font-weight: 400; /* 700 */

    p {
        padding: 12px 15px;
    }
}
</style>

<style lang="scss">
@use "../main";
/* #subnets {
    .v-input__slot {
        width: calc(100% - 24px) !important;
    }
} */
</style>