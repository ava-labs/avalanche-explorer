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
                    :data="versions"
                    :color-scale="versionsColorScale"
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
                    :data="versionsOnly"
                    :color-scale="versionsOnlyColorScale"
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
} from '@/services/peerinfo'

@Component({
    components: {
        PeerStake,
        PeerCount,
        ValidatorStats,
    },
})
export default class Metadata extends Vue {
    versions: null | IVersion[] = null
    versionsColorScale: string[] = []
    versionsOnly: null | IVersion[] = null
    versionsOnlyColorScale: string[] = []

    loading = false

    created() {
        this.getData()
    }

    async getData() {
        this.loading = true
        this.versions = await getPeerInfo()
        this.versionsOnly = getVersionsOnly(this.versions)
        const map = versionsOnlyMap(this.versions)
        this.versionsOnlyColorScale = getVersionsColorMap(map)
        this.versionsColorScale = getVersionsColorMap(map)
        this.versionsColorScale.push(lower)
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
        overflow: auto;
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
            padding: 15px;
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
