<template>
    <div class="subnets">
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

<script>
import { avalanche } from "@/avalanche";
import { subnetMap } from "@/helper";
import Metadata from "../components/Subnets/Metadata.vue";
import Tabs from "../components/Subnets/Tabs.vue";
import Loader from "../components/misc/Loader.vue";
import Content from "@/components/Subnets/Content.vue";
import { AVALANCHE_SUBNET_ID } from "@/store/modules/platform/platform";

export default {
    components: {
        Loader,
        Metadata,
        Content,
        Tabs
    },
    data() {
        return {
            selection: AVALANCHE_SUBNET_ID,
            loading: true,
            blockchains: []
        };
    },
    async created() {
        this.blockchains = await this.getBlockchains();
    },
    filters: {
        subnet(val) {
            return subnetMap(val);
        }
    },
    computed: {
        subnets() {
            const subnets = this.$store.state.Platform.subnets;
            const ordered = {};
            Object.keys(subnets)
                .sort()
                .forEach(key => (ordered[key] = subnets[key]));
            return ordered;
        },
        totalValidators() {
            return this.$store.getters["Platform/totalValidators"];
        },
        totalBlockchains() {
            return this.$store.getters["Platform/totalBlockchains"];
        },
        totalStake() {
            let valBig = this.$store.getters["Platform/totalStake"];
            let res = valBig.div(Math.pow(10, 9));
            return res;
        },
        totalSubnets() {
            return Object.keys(this.$store.state.Platform.subnets).length;
        },
        subnetsByName() {
            let list = [];
            Object.keys(this.subnets).forEach(key => {
                let object = {
                    text: subnetMap(key) ? subnetMap(key) : key,
                    value: key
                };
                list.push(object);
            });
            return list;
        }
    },
    methods: {
        async getBlockchains() {
            return await avalanche.apis.platform
                .getBlockchains()
                .then(res => {
                    this.loading = false;
                    return res;
                })
                .catch(error => console.log(error));
        }
    }
};
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

<style>
.v-input__slot {
    width: calc(100% - 24px) !important;
}

.v-select.v-text-field input {
    border-color: transparent;
}
</style>