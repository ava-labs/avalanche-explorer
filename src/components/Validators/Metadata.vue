<template>
    <div id="validators_meta" class="card meta_data">
        <div class="header">
            <h2>Validators</h2>
        </div>
        <div class="staking_info">
            <validator-stats></validator-stats>
            <div class="peerinfo_cont">
                <div v-show="loading" class="loading_cont">
                    <v-progress-circular
                        :size="16"
                        :width="2"
                        color="#E84970"
                        indeterminate
                    ></v-progress-circular>
                </div>
                <peer-stake
                    v-show="!loading"
                    :data="versions"
                    :metric="'stakeAmount'"
                ></peer-stake>
            </div>
            <div class="peerinfo_cont">
                <div v-show="loading" class="loading_cont">
                    <v-progress-circular
                        :size="16"
                        :width="2"
                        color="#E84970"
                        indeterminate
                    ></v-progress-circular>
                </div>
                <peer-count
                    v-show="!loading"
                    :data="versions"
                    :metric="'nodeCount'"
                ></peer-count>
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
import { toAVAX } from '@/helper'
import {
    DEFAULT_NETWORK_ID,
    peerInfoURL,
    peerInfoURL_test,
} from '@/store/modules/network/network.ts'

export interface IVersion {
    version: string
    nodeCount: number
    stakeAmount: number
}

@Component({
    components: {
        PeerStake,
        PeerCount,
        ValidatorStats,
    },
})
export default class Metadata extends Vue {
    versions: null | IVersion[] = null
    loading = false

    created() {
        this.getData()
    }

    async getData(): Promise<void> {
        this.loading = true

        const url = DEFAULT_NETWORK_ID === 1 ? peerInfoURL : peerInfoURL_test
        const info = (await fetch(url).then((response) =>
            response.text()
        )) as string

        function removePrefix(s: string): string {
            return s.includes('avalanche/') ? s.split('avalanche/')[1] : s
        }

        let peerInfo: IVersion[] = info
            .split('peerinfo')
            .filter((x) => !!x)
            .map((y) => {
                return y
                    .slice(1, -1)
                    .split(',')
                    .reduce((acc, curr) => {
                        return {
                            ...acc,
                            [curr.split('=')[0]]: curr.split('=')[1],
                        }
                    }, {})
            })
            .map((z: any) => {
                return {
                    version: removePrefix(z.version.slice(1, -1)),
                    nodeCount: parseInt(z.nodeCount),
                    stakeAmount: toAVAX(z.stakeAmount),
                }
            })

        const offline = peerInfo.find(
            (i) => i.version === 'offline'
        ) as IVersion

        peerInfo = peerInfo
            .filter((i) => i.version !== 'offline')
            .sort((a, b) =>
                a.version.localeCompare(b.version, undefined, { numeric: true })
            )
            .reverse()
        peerInfo.push(offline)

        this.versions = peerInfo
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

@include xsOnly {
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
