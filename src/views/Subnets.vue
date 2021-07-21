<template>
    <div id="subnets">
        <template v-if="!subnetsLoaded">
            <Loader :content-id="''" :message="'Fetching Subnets'" />
        </template>
        <template v-else>
            <Metadata
                :total-subnets="totalSubnets"
                :total-validators="totalValidators"
                :total-blockchains="totalBlockchains"
                :total-stake="totalStake"
            />
            <div v-if="this.$vuetify.breakpoint.mdAndUp" class="card">
                <Tabs :subnets="subnets" />
            </div>
            <div
                v-if="this.$vuetify.breakpoint.smAndDown"
                class="card selection"
            >
                <v-select
                    v-model="selection"
                    :items="subnetsByName"
                    label="Select Subnet"
                    outlined
                />
                <Content :subnet-i-d="selection" :subnet="subnets[selection]" />
            </div>
        </template>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Mixins, Component } from 'vue-property-decorator'
import { subnetMap } from '@/helper'
import Metadata from '@/components/Subnets/Metadata.vue'
import Tabs from '@/components/Subnets/Tabs.vue'
import Loader from '@/components/misc/Loader.vue'
import Content from '@/components/Subnets/Content.vue'
import { AVALANCHE_SUBNET_ID } from '@/store/modules/platform/platform'
import Big from 'big.js'
import { ISubnets } from '@/store/modules/platform/models'
import { PlatformGettersMixin } from '@/store/modules/platform/platform.mixins'

interface IMap {
    text: string
    value: string
}

@Component({
    components: {
        Loader,
        Metadata,
        Content,
        Tabs,
    },
})
export default class Subnets extends Mixins(PlatformGettersMixin) {
    selection: string = AVALANCHE_SUBNET_ID

    get subnetsLoaded(): boolean {
        return this.$store.state.Platform.subnetsLoaded
    }

    get subnets(): ISubnets {
        const subnets = this.$store.state.Platform.subnets
        const ordered: ISubnets = {}
        Object.keys(subnets)
            .sort()
            .forEach((key) => (ordered[key] = subnets[key]))
        return ordered
    }

    get totalValidators(): number {
        return this.getTotalValidators()
    }

    get totalBlockchains(): number {
        return this.getTotalBlockchains()
    }

    get totalStake(): Big {
        const valBig = this.getTotalStake()
        const res = valBig.div(Math.pow(10, 9))
        return res
    }

    get totalSubnets(): number {
        return Object.keys(this.$store.state.Platform.subnets).length
    }

    get subnetsByName(): IMap[] {
        const list: IMap[] = []
        Object.keys(this.subnets).forEach((key) => {
            const object: IMap = {
                text: subnetMap(key) ? subnetMap(key) : key,
                value: key,
            }
            list.push(object)
        })
        return list
    }
}
</script>

<style scoped lang="scss">
.headers {
    display: grid;
    grid-template-columns: 70px 1fr 1fr 1fr;
    font-size: 12px;
    font-weight: 400;

    p {
        padding: 12px 15px;
    }
}
</style>
