<template>
    <div class="node_versions card">
        <div class="header">
            <h2>Node Versions</h2>
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
// import { node_api } from '@/node_api'

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
    tab = 'nodeCount'

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

    async updateVersions() {
        this.loading = true

        // const url = 'https://explorerapi.avax.network/validators'
        // const test = await fetch(url)
        //     .then((response) => response.text())

        const info = `peerinfo{version="avalanche/1.0.5",nodeCount=11,stakeAmount=127937396758278}
peerinfo{version="avalanche/1.0.4",nodeCount=5,stakeAmount=0}
peerinfo{version="offline",nodeCount=0,stakeAmount=48349000000000}
peerinfo{version="avalanche/1.1.0",nodeCount=736,stakeAmount=245172275786560352}
peerinfo{version="avalanche/1.0.6",nodeCount=4,stakeAmount=107421784572919}
peerinfo{version="avalanche/1.0.2",nodeCount=8,stakeAmount=5674750000000}
peerinfo{version="avalanche/1.0.3",nodeCount=5,stakeAmount=47011882210757}
peerinfo{version="avalanche/1.0.0",nodeCount=12,stakeAmount=50526192410066}
peerinfo{version="avalanche/1.0.1",nodeCount=4,stakeAmount=9299998000000}`

        function removePrefix(s: string): string {
            if (s.includes('avalanche/')) {
                return s.split('avalanche/')[1]
            } else {
                return s
            }
        }

        let blah: IVersion[] = info
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
                    stakeAmount: parseInt(z.stakeAmount),
                }
            })

        const offline = blah.find((i) => i.version === 'offline') as IVersion

        blah = blah
            .filter((i) => i.version !== 'offline')
            .sort((a, b) =>
                a.version.localeCompare(b.version, undefined, { numeric: true })
            )
            .reverse()
        blah.push(offline)

        this.versions = blah
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
                    data: this.versions.map((v) => v.nodeCount),
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
