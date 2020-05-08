<template>
    <div class="blockchain">
        <div class="meta_data">
            <div>
                <p class="label">Total {{validatorType}} Stake Amount</p>
                <p>{{totalStake}} $AVA</p>

            </div>
            <div>
                <p class="label">Number of Validators</p>
                <p>{{validators.length}}</p>
            </div>

        </div>
        <div class="validators">

            <div class="search_tabs">
                <p>Validators</p>
                <input class="search" type="text" v-model="search" placeholder="Search validator..">
                <v-tabs class="tabs" @change="typeChange" active-class="tab_active" height="32" hide-slider>
                    <v-tab>Active</v-tab>
                    <v-tab>Pending</v-tab>
                </v-tabs>
            </div>

            <div class="headers">
                <p style="text-align: center;">Rank</p>
                <p>Validator</p>
                <p style="text-align: right;">Stake</p>
                <p style="text-align: right;">Cumulative Stake</p>
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
    // import Input from "../components/Transaction/Input";

    export default {
        data(){
            return {
                search: '',
                validatorType: 'active', // active | pending
            }
        },
        components: {
            // Input,
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
                let parent = this;
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

                vals = vals.filter((val) => {
                    if(parent.search){
                        if(!val.id.includes(parent.search)){
                            return false;
                        }
                    }
                    return true;
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
        border-top: 1px solid #E7E7E7;


        &:nth-of-type(2n){
            background-color: #F1F9FF;
        }
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
        background-color: #fff;
        border-radius: 6px;
        /*padding: 30px;*/
        margin-bottom: 30px;
        /*margin-bottom: 30px;*/

        > div{
            padding: 30px;
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




    .empty{
        text-align: center;
        padding: 30px;
        opacity: 0.7;
        font-size: 12px;
    }


    .search_tabs{
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-bottom: 30px;

        >p{
            flex-grow: 1;
            font-weight: bold;
        }
    }

    .tabs{
        /*display: flex;*/
        flex-direction: row-reverse;
        display: inline-block;
        width: max-content;
        flex-grow: 0;
    }

    .v-tab{
        color: #000 !important;
        border: 1px solid #000;
        background-color: transparent;
        font-size: 13px;
        margin: 0px 5px;
        border-radius: 4px;
        text-transform: none;
    }

    .tab_active{
        background-color: #000;
        color: #fff !important;
    }


    .search{
        border: 1px solid #D6DAE1;
        height: 32px;
        width: 320px;
        box-sizing: border-box;
        border-radius: 4px;
        padding: 0px 12px;
        outline: none;
        margin-right: 10px;
    }
    @media only screen and (max-width: main.$mobile_width) {
        .validators{
            padding: 5px;
        }

        .search_tabs{
            flex-direction: column;
            justify-content: flex-end;
            align-items: baseline;
        }

        .tabs {
            width: 100%;
        }
        .v-tab {
            flex-grow: 1;
        }

        .search{
            margin: 10px 0px;
            width: 100%;
        }

        .meta_data{
            grid-template-columns: none;
            grid-template-rows: max-content max-content max-content;

            > div{
                text-align: left;
                padding: 10px;
            }
        }
    }
</style>
