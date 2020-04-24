<template>
    <div class="blockchain">
        <div class="meta_data">
            <div>
                <p class="label">Total Stake Amount</p>
                <p>{{totalStake}} nAVA</p>
            </div>
        </div>
        <div class="validators">
            <h2>Validators</h2>
            <div class="validator" v-for="validator in validators" :key="validator.id">
                <div class="id_col">
                    <p class="label">ID</p>
                    <p>{{validator.id}}</p>
                </div>
                <div>
                    <p class="label">Stake Amount</p>
                    <p>{{validator.stakeAmount}}</p>
                </div>

                <div class="time">
                    <div class="display">
                        <time-display :start="validator.startTime"
                                      color_fill="#8be2b8"
                                      :end="validator.endTime"></time-display>
                    </div>
                    <div class="time_info">
                        <div>
                            <p class="label">Start</p>
                            <p>{{validator.startTime | date}}</p>
                        </div>
                        <div>
                            <p class="label">Duration</p>
                            <p>{{validator.startTime | date}}</p>
                        </div>
                        <div>
                            <p class="label">End</p>
                            <p>{{validator.endTime | date}}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import moment from 'moment';
    import TimeDisplay from "../components/Blockchain/TimeDisplay";

    export default {
        components: {
            TimeDisplay
        },
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
        computed:{
            validators(){
                let vals = this.$store.state.Platform.validators;

                vals.sort((a,b) => {
                    let valA = parseInt(a.stakeAmount);
                    let valB = parseInt(b.stakeAmount);

                    if(valA < valB){
                        return 1;
                    }

                    if(valA > valB){
                        return -1;
                    }

                    return 0;
                });
                return vals;
            },
            totalStake(){
                return this.$store.getters['Platform/totalStakeAmount'];
            }
        }
    }
</script>
<style scoped lang="scss">
    .validators{
        background-color: #fff;
        border-radius: 6px;
        padding: 30px;
    }
    .validator{
        display: grid;
        grid-template-columns: 1fr 1fr 2fr;
        padding: 14px 0px;
        border-bottom: 1px solid #E7E7E7;

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

        >div{
            padding: 0px 15px;
        }

        .display{
            height: 4px;
            position: relative;
            background-color: #dfdfdf;
            border-radius: 3px;
            overflow: hidden;
        }
    }

    .time_info{
        display: flex;
        margin-top: 6px;

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
        width: 140px;
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
</style>
