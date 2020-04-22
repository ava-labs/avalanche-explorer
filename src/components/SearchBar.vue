<template>
    <div class="search_bar">
        <input type="text"
               v-model="search_val"
               @keyup.enter="search"
               @input="autoSearch"
               :placeholder="placeholder">
        <v-btn @click="search"
               color="#71C5FF"
               :loading="isAjax"
               depressed
        >
            <fa icon="search"></fa>
        </v-btn>
    </div>
</template>
<script>
    import Vue from "vue";
    import axios from "@/axios";

    export default Vue.extend({
        data(){
            return{
                isAjax: false,
                search_val : '',
            }
        },
        props: {
            placeholder: {
                type: String,
                default: ''
            }
        },
        methods: {
            search(){
                if(!this.canSearch) return;

                this.isAjax = true;
                console.log(`Searching ${this.search_val}`)
            },

            autoSearch(){
                let query = this.search_val;

                console.log(`Searching: ${query}`)
                axios.get('/x/search?query='+query).then(res => {
                    let data = res.data;
                    console.log(res);
                })
            }
        },
        computed: {
            canSearch(){
                if(this.search_val === ''){
                    return false;
                }
                return true;
            }
        }
    })
</script>
<style scoped>
    .search_bar{
        display: flex;
        background-color: transparent;
        overflow: hidden;
    }

    input{
        background-color: transparent;
        color: #333;
        padding: 8px 13px;
        flex-grow: 1;
        outline: none;
        border: 1px solid #D6DAE1;
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;

        border-right: none;
        font-size: 12px;
    }

    .v-btn{
        border: none;
        border-radius: 0;
        cursor: pointer;
        font-size: 12px;
        color: #fff !important;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
    }
</style>
