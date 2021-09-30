<template>
    <div class="peer_info">
        <div class="header">
            <h4 class="meta_title">Peer Count</h4>
            <p class="subtitle">by AvalancheGo Version</p>
        </div>
        <div class="canv_cont">
            <canvas ref="canv"></canvas>
        </div>
    </div>
</template>
<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import Chart from 'chart.js'
import { IVersion } from '@/services/peerinfo'

@Component({
    components: {},
})
export default class PeerCount extends Vue {
    @Prop() data!: IVersion[]
    @Prop() colorScale!: any
    @Prop() metric!: keyof IVersion

    context: null | RenderingContext = null
    chart: null | Chart = null

    @Watch('data')
    onDataChanged() {
        this.draw()
    }

    async mounted() {
        const canvas = this.$refs.canv as HTMLCanvasElement
        this.context = canvas.getContext('2d') as CanvasRenderingContext2D

        this.chart = new Chart(this.context, {
            type: 'horizontalBar',
            data: {
                labels: [],
                datasets: [],
            },
            options: {
                legend: {
                    display: false,
                },
                aspectRatio: 1.25,
                responsive: true,
                scales: {
                    xAxes: [
                        {
                            ticks: {
                                beginAtZero: true,
                            },
                        },
                    ],
                },
            },
        })
    }

    draw() {
        // bind data to chart
        if (this.chart && this.data) {
            this.chart.data.labels = this.data.map((v) => v.version)
            this.chart.data.datasets = [
                {
                    backgroundColor: this.colorScale,
                    data: this.data.map((v) => v[this.metric]) as number[],
                },
            ]
            this.chart.options.tooltips = {
                callbacks: {
                    title: function (tooltipItem, data) {
                        const index = tooltipItem[0].index as number
                        const label = (data.labels as string[])[index]
                        return `Version ${label}`
                    },
                    label: function (tooltipItem, data) {
                        const index = tooltipItem.index as number
                        //@ts-ignore
                        const datum = (data.datasets[0]
                            .data as Chart.ChartPoint[])[index]
                        return ` ${datum} nodes`
                    },
                },
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.header {
    padding-bottom: 30px;
}

h3,
h4 {
    margin: 0;
    font-weight: 400;
}

.subtitle {
    margin-top: 0.2em;
    font-size: 0.875rem;
}

.peer_info {
    display: flex;
    flex-direction: column;
    margin-bottom: 30px;
}

.canv_cont {
    flex-grow: 1;
    width: 100%;
    max-width: 100%;
    position: relative;
}
</style>
