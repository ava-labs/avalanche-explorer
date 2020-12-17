<template>
    <div class="node_versions card">
        <div class="header">
            <h2>Node Versions</h2>
        </div>
        <div class="history_cont">
            <div class="history_settings">
                <button
                    :active="displayKey === options[0]"
                    @click="setdisplayKey(options[0])"
                >
                    Stake Amount
                </button>
                <button
                    :active="displayKey === options[1]"
                    @click="setdisplayKey(options[1])"
                >
                    Nodes
                </button>
            </div>
            <div v-show="loading" class="loading_cont">
                <v-progress-circular
                    :size="16"
                    :width="2"
                    color="#E84970"
                    indeterminate
                ></v-progress-circular>
            </div>
            <div class="canv_cont">
                <canvas ref="canv"></canvas>
            </div>
        </div>
        <div class="history_cont">
            <div v-show="loading" class="loading_cont">
                <v-progress-circular
                    :size="16"
                    :width="2"
                    color="#E84970"
                    indeterminate
                ></v-progress-circular>
            </div>
            <div class="canv_cont">
                <canvas ref="canv"></canvas>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import 'reflect-metadata'
import { Vue, Component } from 'vue-property-decorator'
import Chart from 'chart.js'
import chroma from 'chroma-js'
import { toAVAX } from '@/helper'

interface IVersion {
    version: string
    nodeCount: number
    stakeAmount: number
}

@Component({
    components: {},
})
export default class NodeVersions extends Vue {
    context: null | RenderingContext = null
    versions: null | IVersion[] = null
    chart: null | Chart = null
    loading = false
    options: string[] = ['stakeAmount', 'nodeCount']
    displayKey: keyof IVersion = 'nodeCount'

    mounted() {
        const canvas = this.$refs.canv as HTMLCanvasElement
        this.context = canvas.getContext('2d') as CanvasRenderingContext2D

        const myLineChart = new Chart(this.context, {
            type: 'pie',
            data: {
                labels: [],
                datasets: [],
            },
        })

        this.chart = myLineChart

        this.updateVersions()
    }

    setdisplayKey(val: keyof IVersion) {
        this.displayKey = val
        this.updateVersions()
    }

    async updateVersions() {
        this.loading = true

        const url = 'https://explorerapi.avax.network/validators'
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
        this.draw()
    }

    draw() {
        this.clearChart()

        // bind data to chart
        if (this.chart && this.versions) {
            this.chart.data.labels = this.versions.map((v) => v.version)

            const colorScale = chroma
                .scale(['#e84142', '#ffe6e6'])
                .colors(this.versions.length)

            this.chart.data.datasets = [
                {
                    backgroundColor: colorScale,
                    data: this.versions.map(
                        (v) => v[this.displayKey]
                    ) as number[],
                },
            ]
            this.chart.update()
        }
    }

    clearChart() {
        if (this.chart) {
            this.chart.update()
        }
    }
}
</script>
<style lang="scss" scoped>
.node_versions {
    display: flex;
    flex-direction: column;
}

.header {
    padding-bottom: 30px;
}

.history_cont {
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

.canv_cont {
    flex-grow: 1;
    width: 100%;
    max-width: 100%;
    position: relative;
}

@include smOnly {
    .history_settings {
        margin: 8px 0px;
        display: flex;
        flex-direction: row;
        width: 100%;

        button {
            flex-grow: 1;
            width: auto;
        }
    }
}
</style>
