<template>
    <div class="blockchain">

        <div class="validators">
            <div class="meta_data">
                <div>
                    <p class="label">Total {{validatorType}} Stake Amount</p>
                    <p>{{totalStake}} $AVA</p>

                </div>
                <div>
                    <p class="label">Number of Valdiators</p>
                    <p>{{validators.length}}</p>
                </div>
                <v-tabs class="tabs" @change="typeChange">
                    <v-tab>Active</v-tab>
                    <v-tab>Pending</v-tab>
                </v-tabs>
            </div>

            <div class="headers">
                <p style="text-align: center;">Rank</p>
                <p>Validator</p>
                <p style="text-align: right;">Stake</p>
                <p style="text-align: right;">Comulative Stake</p>
<!--                <p style="text-align: right;">Commission</p>-->
            </div>
            <div v-if="validators.length === 0" class="empty">
                <p>No Validators</p>
            </div>
            <validator-row class="validator" v-for="(validator, i) in validators" :key="validator.id" :rank="i+1" :validator="validator" :cumulative-stake="cummulativeStake[i]"></validator-row>
        </div>
    </div>
</template>
<script>
    import ValidatorRow from "../components/rows/ValidatorRow/ValidatorRow";

    export default {
        data(){
            return {
                validatorType: 'active', // active | pending
            }
        },
        components: {
            ValidatorRow
        },
        methods: {
            typeChange(val){
                if(val){
                    this.validatorType = 'pending';
                }else{
                    this.validatorType = 'active';
                }
            }
        },
        computed:{
            validators(){
                let vals = this.$store.state.Platform.validators;

                if(this.validatorType === 'pending'){
                    vals = this.$store.state.Platform.validatorsPending
                }

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
                let valBig = this.$store.getters['Platform/totalStakeAmount'];

                if(this.validatorType === 'pending'){
                    valBig = this.$store.getters['Platform/totalStakeAmountPending'];
                }


                let res = valBig.div(Math.pow(10,9));
                return res;
            },
            cummulativeStake(){
                let valBig = this.$store.getters['Platform/cumulativeStakeAmount'];
                if(this.validatorType === 'pending'){
                    valBig = this.$store.getters['Platform/cumulativeStakeAmountPending'];
                }

                return valBig;
            }
        }
    }
</script>
<style scoped lang="scss">
    @use '../main';


    .validators{
        background-color: #fff;
        border-radius: 6px;
        padding: 30px;
    }
    .validator{
        border-bottom: 1px solid #E7E7E7;
    }

    .headers{
        display: grid;
        grid-template-columns: 70px 1fr 1fr 1fr;
        font-size: 12px;
        font-weight: bold;

        p{
            padding: 12px 15px;
        }
    }

    .meta_data{
        display: grid;
        width: 100%;
        grid-template-columns: 1fr 1fr max-content;
        /*margin-bottom: 30px;*/

        > div{
            padding: 15px;
            text-align: left;
            line-height: 1.4em;
        }

        p{
            font-size: 32px;
        }

        .label{
            text-transform: capitalize;
            font-size: 14px;
            margin-bottom: 6px;
            opacity: 0.7;
        }

    }


    .tabs{
        display: flex;
        flex-direction: row-reverse;
        margin-bottom: 30px;
    }

    .empty{
        text-align: center;
        padding: 30px;
        opacity: 0.7;
        font-size: 12px;
    }


    @media only screen and (max-width: main.$mobile_width) {
        .validators{
            padding: 5px;
        }


        .meta_data{
            grid-template-columns: none;
            grid-template-rows: max-content max-content max-content;

            > div{
                text-align: left;

            }



        }
    }
</style>
