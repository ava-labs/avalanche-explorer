<template>
    <div class="tx_history">
        <div class="header">
            <h4>Transaction History</h4>
            <div class="history_settings">
                <button :active="scope===options[0]" @click="setScope(options[0])">Yr</button>
                <button :active="scope===options[1]" @click="setScope(options[1])">Mo</button>
                <button :active="scope===options[2]" @click="setScope(options[2])">Wk</button>
                <button :active="scope===options[3]" @click="setScope(options[3])">D</button>
                <button :active="scope===options[4]" @click="setScope(options[4])">Hr</button>
                <button :active="scope===options[5]" @click="setScope(options[5])">Min</button>
            </div>
        </div>
        <div class="canv_cont">
            <canvas ref="canv"></canvas>
        </div>
    </div>
</template>
<script>
    import axios from '@/axios';
    import Chart from 'chart.js'
    import moment from 'moment';


    export default {
        data(){
            return {
                context: null,
                options: [
                    'year',
                    'month',
                    'week',
                    'day',
                    'hour',
                    'minute',
                ],
                scope: 'day',
                history: null,
                chart: null,
            }
        },
        methods: {
            setScope(val){
                this.scope = val;
                this.updateHistory();
            },

            updateHistory(){
                let parent = this;
                // let scope = this.scope;

                // our selected interval in ms
                let interval = this.intervalMs;
                let intervalSize = this.intervalSize;
                let endMs = Date.now();
                // let startMs = endMs - interval;

                let startTime = this.startDate.toISOString();
                let endTime = this.endDate.toISOString();

                // let startSec = Math.round(startMs/1000);
                // let endSec = Math.round(endMs/1000);
                // console.log(startTime);
                // console.log(endTime);
                // console.log( new Date().toISOString());
                axios.get(`/x/transactions/aggregates?startTime=${startTime}&endTime=${endTime}&intervalSize=${intervalSize}`).then(res => {
                    let data = res.data;
                    console.log(data);
                    parent.history = data;
                    parent.draw();
                });
            },

            clearChart(){
                let chart = this.chart;
                chart.data.labels = [];
                chart.data.datasets.forEach((dataset) => {
                    dataset.data = [];
                });
                chart.update();
            },
            draw(){
                this.clearChart();
                let parent = this;

                let dataX = this.valuesX;
                let chart = this.chart;

                dataX.forEach((data,index) => {
                    // let date =  Date.parse(data.startTime);
                    // console.log(date);
                    let label = parent.labelsX[index];

                    chart.data.labels.push(label);
                    chart.data.datasets.forEach((dataset) => {
                        dataset.data.push(data);
                    });
                });
                chart.update();


            }
        },
        computed: {
            intervalMs(){
                let res = 0;
                switch (this.scope) {
                    case 'year':
                        res = 1000 * 60 * 60 * 24 * 365;
                        break;
                    case 'month':
                        res = 1000 * 60 * 60 * 24 * 30;
                        break;
                    case 'week':
                        res = 1000 * 60 * 60 * 24 * 7;
                        break;
                    case 'day':
                        res = 1000 * 60 * 60 * 24;
                        break;
                    case 'hour':
                        res = 1000 * 60 * 60;
                        break;
                    case 'minute':
                        res = 1000 * 60;
                        break;
                }
                return res;
            },
            intervalSize(){
                let res = 'minute';
                switch (this.scope) {
                    case 'year':
                        res = 'month';
                        break;
                    case 'month':
                        // res = `${24*7}h`;
                        res = `day`;
                        break;
                    case 'week':
                        res = 'day';
                        break;
                    case 'day':
                        res = 'hour';
                        break;
                    case 'hour':
                        res = '5m';
                        break;
                    case 'minute':
                        res = '1s';
                        break;
                }
                return res;
            },
            intervalSizeMs(){
                let res = 0;
                switch (this.intervalSize) {
                    case 'month':
                        res = 1000 * 60 * 60 * 24 * 30;
                        break;
                    case 'day':
                        res = 1000 * 60 * 60 * 24;
                        break;
                    case 'hour':
                        res = 1000 * 60 * 60;
                        break;
                    case '5m':
                        res = 1000 * 60 * 5;
                        break;
                    case '5s':
                        res = 1000 * 5;
                        break;
                }
                return res;
            },
            intervalFormat(){
                let res = '';
                let scope = this.scope;
                switch (this.intervalSize) {
                    case 'month':
                        res = 'MMM';
                        break;
                    case `${24*7}h`:
                        res = 'd';
                        break;
                    case 'day':
                        if(scope === 'month'){
                            res = 'MMM DD';
                        }else{
                            res = 'D dd';
                        }
                        break;
                    case '2h':
                        res = 'HH:mm';
                        break;
                    case 'hour':
                        res = 'HH:mm';
                        break;
                    case '5m':
                        res = 'HH:mm';
                        break;
                    case '1s':
                        res = 'mm:ss';
                        break;
                }
                return res;
            },
            startDate(){
                let startMs = Date.now() - this.intervalMs;
                return new Date(startMs);
            },
            endDate(){
                return new Date();
            },
            dataX(){
                if(!this.history) return  [];
                let res = [];
                let intervals = this.history.intervals;
                intervals.forEach((val,i) => {
                    res.push(val);
                });
                return res;
            },
            valuesX(){
                let res = [];

                for(let i=0 ;i<this.dataX.length; i++){
                    let data = this.dataX[i];
                    let txCount = data.transactionCount;
                    res.push(txCount)
                }
                return res;
            },
            labelsX(){
                let res = [];

                // let date = this.startDate;
                // let len = this.dataX.length;
                // let intervalSizeMs = this.intervalSizeMs;

                let datas = this.dataX;
                let len = datas.length;

                for(let i=0; i<len; i++){
                    let data = datas[i];

                    let date = new Date(data.startTime);
                    let mom = moment(date);

                    // if(i%2===0){
                    //     res.push('')
                    //     continue;
                    // }

                    let label = mom.format(this.intervalFormat);
                    res.push(label)
                }

                return res;
            },
        },
        created() {
            this.updateHistory();
        },
        mounted(){
            let cont = this.$refs.canv.getContext('2d');
            this.context = cont;

            let valuesX = this.valuesX;

            let myLineChart = new Chart(cont, {
                type: 'line',
                data: {
                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                    datasets: [{
                        label: 'Tx Volume',
                        backgroundColor: '#71C5FF',
                        borderColor: '#71C5FF',
                        pointBackgroundColor: 'transparent',
                        pointBorderColor: 'transparent',
                        pointHoverBackgroundColor: '#71C5FF',
                        pointHoverBorderColor: '#71C5FF',
                        data: valuesX,
                        fill: false,
                    }]
                },
                options: {
                    maintainAspectRatio: false,
                    responsive: true,
                    title: {
                        display: false,
                        text: 'Chart.js Line Chart'
                    },
                    tooltips: {
                        mode: 'index',
                        enabled: true,
                        intersect: false,
                    },
                    legend: {
                        display: false
                    },
                    hover: {
                        mode: 'nearest',
                        intersect: true
                    },
                    scales: {
                        x: {
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Month'
                            }
                        },

                        y: {
                            display: false,
                            scaleLabel: {
                                display: true,
                                labelString: 'Value'
                            },
                            ticks: {
                                callback: function(value, index, values) {
                                    return '$' + value;
                                }
                            }
                        },
                        xAxes: [{
                            gridLines: {
                                color: "rgba(0, 0, 0, 0.03)",
                            },
                            ticks: {
                                autoSkip: true,
                                maxTicksLimit: 3,
                                maxRotation: 0,
                            }
                        }],
                        yAxes: [{
                            gridLines: {
                                color: "rgba(0, 0, 0, 0.03)",
                            },
                            ticks: {
                                autoSkip: true,
                                maxTicksLimit: 3,
                                precision: 0,
                                min: 0
                            }
                        }],
                    }
                }
            });

            this.chart = myLineChart;
        }
    }
</script>
<style lang="scss" scoped>
    @use '../../../main';

    .tx_history{
        display: flex;
        flex-direction: column;
    }

    .header{
        /*display: flex;*/
        /*flex-wrap: wrap;*/
        /*align-items: flex-start;*/
        margin-bottom: 10px;
    }
    h4{
        font-size: 12px;
        margin: 0 !important;
    }
    .history_settings{
        display: flex;
        flex-direction: row;
        margin: 6px 0px;

        button{

            flex-grow: 1;
            font-size: 9px;
            background-color: #F1F2F3;
            color: #7A838E;
            height: 22px;
            width: 28px;
            border: none;
            margin-left: 3px;
            outline: none;
            border-radius: 2px;


            &[active]{
                color: #fff;
                font-weight: bold;
                background-color: #71C5FF;
            }
        }
    }

    .canv_cont{
        flex-grow: 1;
        width: 100%;
        max-width: 100%;
        position: relative;
    }
    /*canvas{*/
    /*    position: absolute;*/
    /*    width: 100%;*/
    /*    height: 100%;*/
    /*}*/


    @media only screen and (max-width: main.$mobile_width) {
        .header{
            flex-direction: column;
        }

        .history_settings{
            margin: 8px 0px;
            display: flex;
            flex-direction: row;
            width: 100%;

            button{
                flex-grow: 1;
                width: auto;
            }

        }
    }
</style>
