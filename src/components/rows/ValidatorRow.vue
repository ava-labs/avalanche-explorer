<template>
    <div class="validator">
        <div class="id_col">
            <p class="label">ID</p>
            <p>{{validator.id}}</p>
        </div>
        <div class="stake_col">
            <p class="label">Stake Amount</p>
            <p class="amount">{{stakeAmountText}} <span>{{stakeAmountSymbol}}</span></p>
        </div>

        <div class="time">
            <div class="time_info">
                <div>
                    <p class="label">Start</p>
                    <p>{{validator.startTime | date}}</p>
                </div>
                <div>
                    <p class="label">Duration</p>
                    <p>{{duration}}</p>
                </div>
                <div>
                    <p class="label">End</p>
                    <p>{{validator.endTime | date}}</p>
                </div>
            </div>
            <div class="display">
                <time-display :start="validator.startTime"
                              color_fill="#8bbae2"
                              :end="validator.endTime"></time-display>
            </div>
        </div>
    </div>
</template>
<script>
    import moment from 'moment';
    import TimeDisplay from "@/components/Blockchain/TimeDisplay";
    import Big from 'big.js';

    // if below this amount will display in nAVA
    const nanoThresh = 100000000;

    export default {
        filters: {
            date(date){
                let today = new Date();
                let mom =  moment(date).fromNow();


                return mom;
                // if(date.getDay() === today.getUTCDay() && date.getMonth() === today.getUTCMonth() && date.getFullYear() === today.getUTCFullYear()){
                //     return 'Now'
                // }
                // return date.toLocaleString()
            }
        },
        components: {
            TimeDisplay
        },
        props: {
            validator: {
                type: Object,
                required: true
            }
        },
        computed: {
            stakeAmountText(){
                let amount = this.validator.stakeAmount;

                let res = amount.toLocaleString();

                if(amount > nanoThresh) {
                    res = Big(amount).div(Math.pow(10,9)).toFixed(1);
                }


                return res.toLocaleString();
            },
            stakeAmountSymbol(){
                let amount = this.validator.stakeAmount;

                if(amount <= nanoThresh){
                    return' $nAVA';
                }
                return '$AVA';
            },
            duration(){
                let start = this.validator.startTime;
                let end = this.validator.endTime;
                let dur = end-start;

                return moment.duration(dur).humanize();
            }
        }
    }
</script>
<style scoped lang="scss">
    @use '../../main';

    .validator{
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        padding: 14px 0px;

        > div{
            text-align: center;
            padding: 0px 15px;
            display: flex;
            justify-content: center;
            flex-direction: column;
        }

        p{
            text-align: left;
            text-overflow: ellipsis;
            font-size: 12px;
            overflow: hidden;
        }
    }

    .time{
        grid-column: 3/5;

        .display{
            height: 4px;
            position: relative;
            background-color: #dfdfdf;
            border-radius: 3px;
            overflow: hidden;
        }
    }

    .time_info{
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        margin-bottom: 6px;

        >div{
            flex-grow: 1;
        }
        >div:nth-of-type(2) p{
            text-align: center;
        }

        >div:nth-of-type(3) p{
            text-align: right;
        }

        .label{
            font-size: 10px;
        }
    }

    .label{
        opacity: 0.7;
        font-weight: lighter;
    }


    .id_col{
        /*width: 140px;*/
        overflow: hidden;
    }

    .meta_data{
        display: grid;
        width: 100%;
        grid-template-columns: 1fr 1fr 1fr;
        margin-bottom: 30px;

        > div{
            padding: 15px;
            text-align: center;
            line-height: 1.4em;
        }
    }

    /*.amount{*/
    /*    display: flex;*/
    /*    span{*/
    /*        flex-grow: 1;*/
    /*        text-align: right;*/
    /*    }*/
    /*}*/

    .amountd{
        width: max-content;
        border-radius: 4px;
        padding: 6px 12px;
        background-color: #E6F5FF;
        color: #71C5FF;
    }

    .stake_col{
        justify-self: end;
        p{
            text-align: right;
        }
    }
    @media only screen and (max-width: main.$mobile_width) {
        .validator{
            grid-template-columns: 1fr 1fr;
            grid-template-rows: max-content max-content;

            > div{
                margin-bottom: 10px;
            }
        }

        .time{
            grid-column: 1/3;
            grid-row: 2;
        }


    }
</style>
