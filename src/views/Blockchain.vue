<template>
    <div class="blockchain">
        <div class="meta_data">
            <div>
                <p class="label">Total Stake Amount</p>
                <p>{{totalStake}} $AVA</p>
            </div>
        </div>
        <div class="validators">
            <h2>Validators</h2>
            <validator-row class="validator" v-for="validator in validators" :key="validator.id" :validator="validator"></validator-row>
        </div>
    </div>
</template>
<script>
    import ValidatorRow from "../components/rows/ValidatorRow";

    export default {
        components: {
            ValidatorRow
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
                let valBig = this.$store.getters['Platform/totalStakeAmount'];

                let res = valBig.div(Math.pow(10,9));
                return res;
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

    .meta_data{
        display: grid;
        width: 100%;
        grid-template-columns: 1fr;
        margin-bottom: 30px;

        > div{
            padding: 15px;
            text-align: left;
            line-height: 1.4em;
        }

        p{
            font-size: 32px;
        }

        .label{
            font-size: 14px;
            margin-bottom: 6px;
            opacity: 0.7;
        }

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
