<template>
    <div class="tx_history">
        <div class="header">
            <h2>Transaction History</h2>
        </div>
        <div class="history_cont">
            <div class="history_settings">
                <button :active="scope===options[0]" @click="setScope(options[0])">Yr</button>
                <button :active="scope===options[1]" @click="setScope(options[1])">Mo</button>
                <button :active="scope===options[2]" @click="setScope(options[2])">Wk</button>
                <button :active="scope===options[3]" @click="setScope(options[3])">D</button>
                <button :active="scope===options[4]" @click="setScope(options[4])">Hr</button>
                <button :active="scope===options[5]" @click="setScope(options[5])">Min</button>
            </div>
            <div v-show="loading" class="loading_cont">
                <v-progress-circular :size="16" :width="2" color="#E84970" indeterminate></v-progress-circular>
            </div>
            <div class="canv_cont">
                <canvas ref="canv"></canvas>
            </div>
        </div>
    </div>
</template>
<script>
import axios from "@/axios";
import Chart from "chart.js";
import moment from "moment";

export default {
    data() {
        return {
            context: null,
            options: ["year", "month", "week", "day", "hour", "minute"],
            scope: "day",
            history: null,
            chart: null,
            loading: false
        };
    },
    methods: {
        setScope(val) {
            this.scope = val;
            this.updateHistory();
        },

        updateHistory() {
            this.loading = true;
            
            let interval = this.intervalMs;                     // our selected interval (startTime to endTime) in ms 
            let intervalSize = this.intervalSize;               // integral (granularity)
            
            let now = Date.now();
            let roundedNow = this.roundToNearestInterval(now);  // clean time intervals
            
            let endTime = new Date(roundedNow).toISOString();  
            let startTime = new Date(roundedNow - interval).toISOString();
                        
            // depending on option, round down to nearest whole interral
            let rounded = this.roundToNearestInterval(1599611677254);
            
            // TODO: support service for multiple chains
            // TODO: asset param when supported by API
            axios.get(`/x/transactions/aggregates?startTime=${startTime}&endTime=${endTime}&intervalSize=${intervalSize}`)
                .then(res => {
                    let data = res.data;
                    this.loading = false;
                    this.history = data;
                    this.draw();
                });
        }, 
        roundToNearestInterval(now) {
            let res = 0
            switch (this.scope) {
                case "year":
                    // round to nearest month
                    res = new moment(now).startOf('month').valueOf();
                    break;
                case "month":
                    // round to nearest day
                    res = new moment(now).startOf('day').valueOf();
                    break;
                case "week":
                    // round to nearest day
                    res = new moment(now).startOf('day').valueOf();s
                    break;
                case "day":
                    // round to nearest hour
                    res = new moment(now).startOf('hour').valueOf();
                    break;
                case "hour":
                    // round to nearest minute
                    res = new moment(now).startOf('minute').valueOf();
                    break;
                case "minute":
                    // round to nearest second
                    res = new moment(now).startOf('second').valueOf();
                    break;
            }
            return res;
        },
        clearChart() {
            let chart = this.chart;
            chart.data.labels = [];
            chart.data.datasets.forEach(dataset => {
                dataset.data = [];
            });
            chart.update();
        },
        draw() {
            this.clearChart();

            let dataX = this.valuesX;
            let chart = this.chart;

            dataX.forEach((data, index) => {
                let label = this.labelsX[index];
                chart.data.labels.push(label);
                chart.data.datasets.forEach(dataset => {
                    dataset.data.push(data);
                });
            });
            chart.update();
        }
    },
    computed: {
        intervalMs() {
            let res = 0;
            switch (this.scope) {
                case "year":
                    res = 1000 * 60 * 60 * 24 * 365;
                    break;
                case "month":
                    res = 1000 * 60 * 60 * 24 * 30;
                    break;
                case "week":
                    res = 1000 * 60 * 60 * 24 * 7;
                    break;
                case "day":
                    res = 1000 * 60 * 60 * 24;
                    break;
                case "hour":
                    res = 1000 * 60 * 60;
                    break;
                case "minute":
                    res = 1000 * 60;
                    break;
            }
            return res;
        },
        intervalSize() {
            let res = "minute";
            switch (this.scope) {
                case "year":
                    res = "month";
                    break;
                case "month":
                    res = "day";
                    break;
                case "week":
                    res = "day";
                    break;
                case "day":
                    res = "hour";
                    break;
                case "hour":
                    res = "5m";
                    break;
                case "minute":
                    res = "1s";
                    break;
            }
            return res;
        },
        intervalSizeMs() {
            let res = 0;
            switch (this.intervalSize) {
                case "month":
                    res = 1000 * 60 * 60 * 24 * 30;
                    break;
                case "day":
                    res = 1000 * 60 * 60 * 24;
                    break;
                case "hour":
                    res = 1000 * 60 * 60;
                    break;
                case "10m":
                    res = 1000 * 60 * 5;
                    break;
                case "5s":
                    res = 1000 * 5;
                    break;
            }
            return res;
        },
        intervalFormat() {
            let res = "";
            let scope = this.scope;
            switch (this.intervalSize) {
                case "month":
                    res = "MMM";
                    break;
                case `${24 * 7}h`:
                    res = "d";
                    break;
                case "day":
                    if (scope === "month") {
                        res = "MMM DD";
                    } else {
                        res = "D dd";
                    }
                    break;
                case "2h":
                    res = "HH:mm";
                    break;
                case "hour":
                    res = "HH:mm";
                    break;
                case "5m":
                    res = "HH:mm";
                    break;
                case "1s":
                    res = "mm:ss";
                    break;
            }
            return res;
        },
        dataX() {
            if (!this.history) return [];
            let res = [];
            let intervals = this.history.intervals;
            intervals.forEach((val, i) => {
                res.push(val);
            });
            return res;
        },
        valuesX() {
            let res = [];

            for (let i = 0; i < this.dataX.length; i++) {
                let data = this.dataX[i];
                let txCount = data.transactionCount;
                res.push(txCount);
            }
            return res;
        },
        labelsX() {
            let res = [];
            let datas = this.dataX;
            let len = datas.length;

            for (let i = 0; i < len; i++) {
                let data = datas[i];
                let date = new Date(data.startTime);
                let mom = moment(date);
                let label = mom.format(this.intervalFormat);
                res.push(label);
            }
            return res;
        }
    },
    created() {
        this.updateHistory();
    },
    mounted() {
        let cont = this.$refs.canv.getContext("2d");
        this.context = cont;

        let valuesX = this.valuesX;

        let myLineChart = new Chart(cont, {
            type: "line",
            data: {
                labels: [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July"
                ],
                datasets: [
                    {
                        label: "Tx Volume",
                        backgroundColor: "#e84970",
                        borderColor: "#e84970",
                        pointBackgroundColor: "transparent",
                        pointBorderColor: "transparent",
                        pointHoverBackgroundColor: "#e84970",
                        pointHoverBorderColor: "#e84970",
                        data: valuesX,
                        fill: false
                    }
                ]
            },
            options: {
                maintainAspectRatio: false,
                responsive: true,
                title: {
                    display: false,
                    text: "Avalanche Transaction History"
                },
                tooltips: {
                    mode: "index",
                    enabled: true,
                    intersect: false
                },
                legend: {
                    display: false
                },
                hover: {
                    mode: "nearest",
                    intersect: true
                },
                scales: {
                    x: {
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: "Month"
                        }
                    },

                    y: {
                        display: false,
                        scaleLabel: {
                            display: true,
                            labelString: "Value"
                        },
                        ticks: {
                            callback: function(value, index, values) {
                                return "$" + value;
                            }
                        }
                    },
                    xAxes: [
                        {
                            gridLines: {
                                color: "rgba(0, 0, 0, 0.03)"
                            },
                            ticks: {
                                autoSkip: true,
                                maxTicksLimit: 3,
                                maxRotation: 0
                            }
                        }
                    ],
                    yAxes: [
                        {
                            gridLines: {
                                color: "rgba(0, 0, 0, 0.03)"
                            },
                            ticks: {
                                autoSkip: true,
                                maxTicksLimit: 3,
                                precision: 0,
                                min: 0
                            }
                        }
                    ]
                }
            }
        });

        this.chart = myLineChart;
    }
};
</script>
<style lang="scss" scoped>
@use "../../../main";

.tx_history {
    display: flex;
    flex-direction: column;
}

.header {
    padding-bottom: 20px;
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
        color: main.$black;
        height: 22px;
        width: 28px;
        border: none;
        margin-left: 3px;
        outline: none;
        border-radius: 2px;

        &:hover {
            opacity: 0.7;
        }

        &[active] {
            color: main.$white;
            font-weight: 400; /* 700 */
            background-color: main.$primary-color;
        }
    }
}

.loading_cont {
    position: absolute;
    background-color: main.$white;
    margin-top: 40px;
    top: -5px;
    left: 0;
    width: 100%;
    height: calc(100% - 40px);
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;;
}

.canv_cont {
    flex-grow: 1;
    width: 100%;
    max-width: 100%;
    position: relative;
}

@include main.device_s {
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
