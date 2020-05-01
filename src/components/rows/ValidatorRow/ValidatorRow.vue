<template>
    <div class="validator">
        <div class="rank">
            <div>
                <p>{{rank}}</p>
            </div>
        </div>
        <div class="id_col">
            <p>{{validator.id}}</p>
        </div>
        <div class="stake_col">
            <p>{{stakeAmountText}}</p>
            <p>{{stakePercText}}%</p>
        </div>
        <div class="comm_col">
            <p>{{cumulativePercText}}%</p>
            <comulative-bar :total="totalStake" :accumulated="cumulativeStake" :amount="stakeAmount"></comulative-bar>
        </div>
        <div class="commission_col">
            <p>4%</p>
        </div>
    </div>
</template>
<script>
    import moment from 'moment';
    // import TimeDisplay from "@/components/Blockchain/TimeDisplay";
    import Big from 'big.js';
    import {stringToBig} from "../../../helper";
    import ComulativeBar from "./ComulativeBar";

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
            // TimeDisplay
            ComulativeBar,
        },
        props: {
            validator: {
                type: Object,
                required: true
            },
            rank: {
                type: Number,
                required: true,
            },
            cumulativeStake: {
                type: Big,
                required: true,
            }
        },
        computed: {
            totalStake(){
                return this.$store.getters['Platform/totalStakeAmount'];
            },
            stakeAmountText(){
                let amount = this.validator.stakeAmount;
                let res = stringToBig(amount,9);

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
            },
            stakeAmount(){
                return Big(this.validator.stakeAmount);
            },
            stakePerc(){
                let amt = this.stakeAmount;
                let tot = this.totalStake;
                return amt.div(tot)
            },
            stakePercText(){
                return this.stakePerc.times(100).toFixed(8);
            },
            cumulativePercText(){
                return this.cumulativeStake.div(this.totalStake).times(100).toFixed(2);
            }
        }
    }
</script>
<style scoped lang="scss">
    @use '../../../main';

    .validator{
        display: grid;
        grid-template-columns: 70px 1fr 1fr 1fr 1fr;

        > div{
            text-align: center;
            padding: 10px 15px;
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


    .rank{
        >div{
            /*background-color: #56C18D;*/
            width: 40px;
            height: 40px;
            border-radius: 40px;
            line-height: 40px;
        }

        p{
            width: 100%;
            text-align: center;
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

    .commission_col{
        p{
            text-align: right;
        }
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
        /*justify-self: end;*/
        p{
            text-align: right;

            &:last-of-type{
                opacity: 0.4;
            }
        }
    }

    .comm_col{
        position: relative;
        border-right: 1px solid #f0f0f0;
        border-left: 1px solid #f0f0f0;

        p{
            z-index: 2;
            text-align: right;
        }
    }
    @media only screen and (max-width: main.$mobile_width) {
        .validator{
            grid-template-columns: 70px 1fr 1fr 1fr 1fr;
            grid-template-rows: max-content max-content;

        }

        .time{
            grid-column: 1/3;
            grid-row: 2;
        }


    }
</style>
