<template>
    <div id="subnet_details" class="detail">
        <v-breadcrumbs :items="breadcrumbs" />
        <template v-if="!subnetsLoaded">
            <Loader
                :content-id="subnetID"
                :message="'Fetching Subnet Details'"
            />
        </template>
        <template v-else>
            <div class="card">
                <Content :subnet-i-d="subnetID" :subnet="subnets[subnetID]" />
            </div>
        </template>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Watch } from 'vue-property-decorator'
import Loader from '@/components/misc/Loader.vue'
import { ISubnets } from '@/store/modules/platform/models'
import Subnet from '@/js/Subnet'
import Content from '@/components/Subnets/Content.vue'

@Component({
    components: {
        Loader,
        Content,
    },
})
export default class SubnetPage extends Vue {
    subnet: Subnet | null = null

    breadcrumbs: any = [
        {
            text: 'Home',
            disabled: false,
            href: '/',
        },
        {
            text: 'Subnets',
            disabled: false,
            href: '/subnets',
        },
    ]

    @Watch('subnetsLoaded')
    onSubnetsLoadedChanged() {
        this.getData()
    }

    created() {
        this.getData()
    }

    get subnets(): ISubnets {
        return this.$store.state.Platform.subnets
    }

    get subnetID(): string {
        return this.$route.params.id
    }

    get subnetsLoaded(): boolean {
        return this.$store.state.Platform.subnetsLoaded
    }

    getData(): void {
        if (this.subnetsLoaded) {
            this.subnet = this.subnets[this.subnetID]
        }
    }
}
</script>
