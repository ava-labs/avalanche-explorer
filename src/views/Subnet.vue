<template>
    <div id="subnet_details" class="detail">
        <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
        <template v-if="!subnetsLoaded">
            <Loader :contentId="subnetID" :message="'Fetching Subnet Details'"/>
        </template>
        <template v-else>
            <div class="card">
                <Content :subnetID="subnetID" :subnet="subnets[subnetID]"></Content>
            </div>
        </template>
    </div>
</template>

<script lang="ts">
import "reflect-metadata";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import Loader from "../components/misc/Loader.vue";
import { Subnets } from "@/store/modules/platform/IPlatformState";
import Subnet from '@/js/Subnet';
import Content from "@/components/Subnets/Content.vue";

@Component({
    components: {
        Loader,
        Content,
    }
})
export default class SubnetPage extends Vue {
    subnet: Subnet | null = null;

    breadcrumbs: any = [
        {
            text: "Home",
            disabled: false,
            href: "/"
        },
        {
            text: "Subnets",
            disabled: false,
            href: "/subnets"
        }
    ];

    @Watch("subnetsLoaded")
    onSubnetsLoadedChanged() {
        this.getData();
    }
    
    created() {
        this.getData();
    }

    get subnets(): Subnets {
        return this.$store.state.Platform.subnets;
    }

    get subnetID(): string {
        return this.$route.params.id;
    }

    get subnetsLoaded() {
        return this.$store.state.Platform.subnetsLoaded;
    }

    getData(): void {
        if (this.subnetsLoaded) {
            this.subnet = this.subnets[this.subnetID];
        }
    }
}
</script>

<style scoped lang="scss">
@use "../main";
</style>
