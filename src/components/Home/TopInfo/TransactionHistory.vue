<template>
    <div>
        <div class="header">
            <h4>AVA Transaction History</h4>
            <div class="history_settings">
                <button :active="scope===options[0]" @click="setScope(options[0])">Yr</button>
                <button :active="scope===options[1]" @click="setScope(options[1])">Mo</button>
                <button :active="scope===options[2]" @click="setScope(options[2])">Wk</button>
                <button :active="scope===options[3]" @click="setScope(options[3])">D</button>
                <button :active="scope===options[4]" @click="setScope(options[4])">Hr</button>
                <button :active="scope===options[5]" @click="setScope(options[5])">Min</button>
            </div>
        </div>
        <div>
<!--            <p>{{history}}</p>-->
        </div>
    </div>
</template>
<script>
    import axios from '@/axios';

    export default {
        data(){
            return {
                options: [
                    'year',
                    'month',
                    'week',
                    'day',
                    'hour',
                    'minute',
                ],
                scope: 'day',
                history: {},
            }
        },
        methods: {
            setScope(val){
                this.scope = val;
                this.updateHistory();
            },

            updateHistory(){
                let parent = this;
                let scope = this.scope;
                axios.get('/x/transactions/aggregates?timeframe='+scope).then(res => {
                    let data = res.data;
                    // console.log(data);
                    parent.history = data;
                });
            }
        },
        created() {
            this.updateHistory();
        }
    }
</script>
<style lang="scss" scoped>
    .header{
        display: flex;
        align-items: flex-start;
    }
    h4{
        font-size: 12px;
        margin: 0 !important;
    }
    .history_settings{
        margin-left: 15px;
        button{
            font-size: 9px;
            background-color: #F1F2F3;
            color: #7A838E;
            height: 24px;
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
</style>
