<template>
    <div id="validators_meta" class="card meta_data">
        <div class="header">
            <h2>Validators</h2>
        </div>
        <div class="staking_info">
            <ValidatorStats />
            <div class="peerinfo_cont">
                <div v-show="loading" class="loading_cont">
                    <v-progress-circular
                        :size="16"
                        :width="2"
                        color="#E84970"
                        indeterminate
                    />
                </div>
                <PeerStake
                    v-show="!loading"
                    :data="stakes"
                    :color-scale="stakesColorScale"
                    :metric="'stakePercent'"
                />
            </div>
            <div class="peerinfo_cont">
                <div v-show="loading" class="loading_cont">
                    <v-progress-circular
                        :size="16"
                        :width="2"
                        color="#E84970"
                        indeterminate
                    />
                </div>
                <PeerCount
                    v-show="!loading"
                    :data="versions"
                    :color-scale="versionsColorScale"
                    :metric="'nodeCount'"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component } from 'vue-property-decorator'
import PeerCount from '@/components/Validators/PeerCount.vue'
import PeerStake from '@/components/Validators/PeerStake.vue'
import ValidatorStats from '@/components/Validators/ValidatorStats.vue'
import {
    IVersion,
    getPeerInfo,
    getVersionsOnly,
    versionsOnlyMap,
    getVersionsColorMap,
    lower,
    getStakesOnly,
} from '@/services/peerinfo'

@Component({
    components: {
        PeerStake,
        PeerCount,
        ValidatorStats,
    },
})
export default class Metadata extends Vue {
    stakes: null | IVersion[] = null
    stakesColorScale: string[] = []

    versions: null | IVersion[] = null
    versionsColorScale: string[] = []

    loading = false

    created() {
        this.getData()
    }

    async getData() {
        this.loading = true
        const peerInfo = await getPeerInfo()

        // this map is used to create color scales
        const map = versionsOnlyMap(peerInfo)

        // bar chart - only node counts > 0. exclude 'offline'
        this.versions = getVersionsOnly(peerInfo)
        this.versionsColorScale = getVersionsColorMap(map)

        // pie chart - only stakes > 0. include 'offline'
        this.stakes = getStakesOnly(peerInfo)
        this.stakesColorScale = getVersionsColorMap(map) // extend the versions-only color scale
        this.stakesColorScale.push(lower) // by adding extra color for 'offline' stake

        this.loading = false
    }
}
</script>

<style scoped lang="scss">
.staking_info {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    column-gap: 15px;
    padding: 0;
    width: 100%;
    background: transparent;
    overflow: visible;

    > div {
        padding: 24px 0;
        overflow: hidden;
    }
}

.peerinfo_cont {
    position: relative;
}

.loading_cont {
    position: absolute;
    background-color: $white;
    margin-top: 40px;
    top: -5px;
    left: 0;
    width: 100%;
    height: calc(100% - 40px);
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
}

@include lgOnly {
    .staking_info {
        grid-template-columns: 1fr 1fr 1fr;
    }
}

@include smOnly {
    .staking_info {
        grid-template-columns: 1fr;
        grid-template-rows: max-content max-content max-content;
        padding: 0;

        > div {
            margin-bottom: 15px;
        }

        > div:last-of-type {
            margin-bottom: 0;
        }
    }
}

@include xsOrSmaller {
    .staking_info {
        grid-template-columns: 1fr;

        > div {
            padding: 15px 0;
            margin-bottom: 15px;
        }
    }
}

.meta_data {
    margin-bottom: 30px;

    .header {
        display: flex;
        justify-content: space-between;
    }
}

.meta_content {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
}
</style>
