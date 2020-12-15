<template>
    <div class="tx_history card">
        <div class="header">
            <h2>
                Transaction History
                <TooltipHeading
                    content="Timeline of transactions on Avalanche"
                ></TooltipHeading>
            </h2>
        </div>
        <div class="history_cont">
            <div class="history_settings">
                <button
                    :active="scope === options[0]"
                    @click="setScope(options[0])"
                >
                    1 year
                </button>
                <button
                    :active="scope === options[1]"
                    @click="setScope(options[1])"
                >
                    1 mo
                </button>
                <button
                    :active="scope === options[2]"
                    @click="setScope(options[2])"
                >
                    1 week
                </button>
                <button
                    :active="scope === options[3]"
                    @click="setScope(options[3])"
                >
                    1 day
                </button>
                <button
                    :active="scope === options[4]"
                    @click="setScope(options[4])"
                >
                    1 hr
                </button>
                <button
                    :active="scope === options[5]"
                    @click="setScope(options[5])"
                >
                    1 min
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
        <template v-if="aggregates && !loading">
            <TransactionHistoryMeta
                :aggregates="aggregates"
            ></TransactionHistoryMeta>
        </template>
    </div>
</template>
<script>
import TooltipHeading from '../../misc/TooltipHeading.vue'
import axios from '@/axios'
import Chart from 'chart.js'
import moment from 'moment'
import TransactionHistoryMeta from '@/components/Home/TopInfo/TransactionHistoryMeta'

export default {
    components: {
        TooltipHeading,
        TransactionHistoryMeta,
    },
    data() {
        return {
            context: null,
            options: ['year', 'month', 'week', 'day', 'hour', 'minute'],
            scope: 'day',
            history: null,
            chart: null,
            loading: false,
            aggregates: null,
        }
    },
    computed: {
        intervalMs() {
            let res = 0
            switch (this.scope) {
                case 'year':
                    res = 1000 * 60 * 60 * 24 * 365
                    break
                case 'month':
                    res = 1000 * 60 * 60 * 24 * 30
                    break
                case 'week':
                    res = 1000 * 60 * 60 * 24 * 7
                    break
                case 'day':
                    res = 1000 * 60 * 60 * 24
                    break
                case 'hour':
                    res = 1000 * 60 * 60
                    break
                case 'minute':
                    res = 1000 * 60
                    break
            }
            return res
        },
        intervalSize() {
            let res = 'minute'
            switch (this.scope) {
                case 'year':
                    res = 'month'
                    break
                case 'month':
                    res = 'day'
                    break
                case 'week':
                    res = 'day'
                    break
                case 'day':
                    res = 'hour'
                    break
                case 'hour':
                    res = '5m'
                    break
                case 'minute':
                    res = '1s'
                    break
            }
            return res
        },
        intervalSizeMs() {
            let res = 0
            switch (this.intervalSize) {
                case 'month':
                    res = 1000 * 60 * 60 * 24 * 30
                    break
                case 'day':
                    res = 1000 * 60 * 60 * 24
                    break
                case 'hour':
                    res = 1000 * 60 * 60
                    break
                case '5m':
                    res = 1000 * 60 * 5
                    break
                case '1s':
                    res = 1000
                    break
            }
            return res
        },
        intervalFormat() {
            let res = ''
            const scope = this.scope

            switch (this.intervalSize) {
                case 'month':
                    res = 'MMM YYYY'
                    break

                case 'day':
                    if (scope === 'month') {
                        res = 'MMM DD'
                    } else {
                        res = 'MMM D'
                    }
                    break

                case 'hour':
                    res = 'h:mm a'
                    break

                case '5m':
                    res = 'h:mm a'
                    break

                case '1s':
                    res = 'h:mm:ss a'
                    break
            }
            return res
        },
        xAxislabel() {
            let res = ''
            switch (this.scope) {
                case 'year':
                    res = 'month'
                    break
                case 'month':
                    res = 'date'
                    break
                case 'week':
                    res = 'date'
                    break
                case 'day':
                    res = 'time'
                    break
                case 'hour':
                    res = 'time'
                    break
                case 'minute':
                    res = 'time'
                    break
            }
            return res
        },
        maxTicksLimit() {
            let res = 1
            switch (this.scope) {
                case 'year':
                    res = 4
                    break
                case 'month':
                    res = 4
                    break
                case 'week':
                    res = 7
                    break
                case 'day':
                    res = 6
                    break
                case 'hour':
                    res = 5
                    break
                case 'minute':
                    res = 3
                    break
            }
            return res
        },
        yAxesTicksMax() {
            let res = 1
            switch (this.scope) {
                case 'year':
                    res = 1000000
                    break
                case 'month':
                    res = 100000
                    break
                case 'week':
                    res = 100000
                    break
                case 'day':
                    res = 10000
                    break
                case 'hour':
                    res = 1000
                    break
                case 'minute':
                    res = 1000
                    break
            }
            return res
        },
        // raw data
        dataX() {
            const rawData = !this.history ? [] : this.history.intervals
            // the last item in the data series will not constitute a full time intergral
            // replace its data with a projection based on the series avg, if necessary ("sad")
            if (rawData.length > 0) {
                const average = (
                    rawData
                        .map((d) => d.transactionCount)
                        .reduce((acc, c) => acc + c, 0) / rawData.length
                ).toFixed(0)
                const lastValue = rawData[rawData.length - 1].transactionCount
                if (lastValue < average) {
                    rawData[rawData.length - 1].transactionCount = average
                }
            }
            return rawData
        },
        // charted data
        valuesX() {
            return this.dataX.map((d) => d.transactionCount)
        },
        // x-axis labels
        labelsX() {
            return this.dataX.map((d) =>
                moment(new Date(d.startTime)).format(this.intervalFormat)
            )
        },
    },
    created() {
        this.updateHistory()
    },
    mounted() {
        this.context = this.$refs.canv.getContext('2d')

        const myLineChart = new Chart(this.context, {
            type: 'line',
            data: {
                labels: [
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                ],
                datasets: [
                    {
                        label: 'Tx Volume',
                        backgroundColor: 'transparent',
                        borderColor: '#e84970',
                        pointBackgroundColor: 'transparent',
                        pointBorderColor: 'transparent',
                        pointHoverBackgroundColor: '#e84970',
                        pointHoverBorderColor: '#e84970',
                        data: this.valuesX,
                        lineTension: 0,
                    },
                ],
            },

            options: {
                aspectRatio: 1.62,
                maintainAspectRatio: true,
                responsive: true,
                title: {
                    display: false,
                    text: 'Avalanche Transaction History',
                },
                tooltips: {
                    mode: 'index',
                    enabled: true,
                    intersect: false,
                },
                legend: {
                    display: false,
                },
                hover: {
                    mode: 'nearest',
                    intersect: true,
                },
                scales: {
                    x: {
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: this.xAxislabel,
                        },
                    },
                    y: {
                        display: false,
                        scaleLabel: {
                            display: true,
                            labelString: 'Value',
                        },
                        ticks: {
                            callback: function (value, index, values) {
                                return '$' + value
                            },
                        },
                    },
                    xAxes: [
                        {
                            gridLines: {
                                color: 'rgba(0, 0, 0, 0.03)',
                            },
                            ticks: {
                                autoSkip: true,
                                maxTicksLimit: this.maxTicksLimit,
                                maxRotation: 30,
                            },
                        },
                    ],
                    yAxes: [
                        {
                            type: 'logarithmic',
                            gridLines: {
                                color: 'rgba(255, 0, 0, 0.03)',
                                zeroLineWidth: 0,
                            },
                            ticks: {
                                autoSkip: true,
                                precision: 0,
                                min: 0,
                                max: 100000,
                                callback: function (value, index, values) {
                                    switch (value) {
                                        case 1000000:
                                            return '1M'
                                        case 100000:
                                            return '100K'
                                        case 10000:
                                            return '10K'
                                        case 1000:
                                            return '1K'
                                        case 100:
                                            return '100'
                                        case 10:
                                            return '10'
                                        case 0:
                                            return '0'
                                        default:
                                            return null
                                    }
                                },
                            },
                        },
                    ],
                },
            },
        })

        this.chart = myLineChart
    },
    methods: {
        setScope(val) {
            this.scope = val
            this.updateHistory()
        },
        updateHistory() {
            this.loading = true

            const interval = this.intervalMs // our selected interval (startTime to endTime) in ms
            const intervalSize = this.intervalSize // integral (granularity)

            const now = Date.now()
            const roundedNow = this.roundToNearestInterval(now) // round to nearest whole integral for cleaner time presentation

            const endTime = new Date(roundedNow).toISOString()
            const startTime = new Date(roundedNow - interval).toISOString()

            // TODO: support service for multiple chains
            // TODO: asset param when supported by API
            axios
                .get(
                    `/x/transactions/aggregates?startTime=${startTime}&endTime=${endTime}&intervalSize=${intervalSize}`
                )
                .then((res) => {
                    this.loading = false
                    this.history = res.data
                    this.aggregates = res.data.aggregates
                    this.draw()
                })
        },
        roundToNearestInterval(now) {
            let res = 0
            switch (this.scope) {
                case 'year':
                    // round to nearest month
                    res =
                        new moment(now).startOf('month').valueOf() +
                        1000 * 60 * 60 * 24 * 30
                    break
                case 'month':
                    // round to nearest day
                    res =
                        new moment(now).startOf('day').valueOf() +
                        1000 * 60 * 60 * 24
                    break
                case 'week':
                    // round to nearest day
                    res =
                        new moment(now).startOf('day').valueOf() +
                        1000 * 60 * 60 * 24
                    break
                case 'day':
                    // round to nearest hour
                    res =
                        new moment(now).startOf('hour').valueOf() +
                        1000 * 60 * 60
                    break
                case 'hour':
                    // round to nearest minute
                    res =
                        new moment(now).startOf('minute').valueOf() + 1000 * 60
                    break
                case 'minute':
                    // round to nearest second
                    res = new moment(now).startOf('second').valueOf() + 1000
                    break
            }
            return res
        },
        draw() {
            this.clearChart()
            // bind data to chart
            this.chart.options.scales.xAxes[0].ticks.maxTicksLimit = this.maxTicksLimit
            this.valuesX.forEach((d, i) => {
                const label = this.labelsX[i]
                this.chart.data.labels.push(label)
                this.chart.data.datasets.forEach((dataset) => {
                    dataset.data.push(d)
                })
            })
            this.chart.update()
        },
        clearChart() {
            // clear labels
            this.chart.data.labels = []
            // clear data
            this.chart.data.datasets.forEach((dataset) => {
                dataset.data = []
            })
            // reset y-axis
            this.chart.options.scales.yAxes[0].ticks.max = this.yAxesTicksMax
            // update
            this.chart.update()
        },
    },
}
</script>
<style lang="scss" scoped>
.tx_history {
    display: flex;
    flex-direction: column;
}

.header {
    padding-bottom: 30px;
}

.history_cont {
    position: relative;
}

.history_settings {
    display: flex;
    flex-direction: row;
    margin: 2px 0 20px;

    button {
        flex-grow: 1;
        font-size: 9px;
        background-color: transparent;
        color: $primary-color;
        height: 24px;
        width: 28px;
        border: none;
        margin-left: 3px;
        outline: none;
        border-radius: 2px;
        padding: 1px 3px;
        font-weight: 700;
        text-transform: uppercase;
        cursor: pointer;

        &:hover {
            opacity: 0.7;
        }

        &[active] {
            color: $white;
            background-color: $primary-color;
        }
    }
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
