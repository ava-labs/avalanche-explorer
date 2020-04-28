<template>
    <div class="search_bar">
        <input type="text"
               v-model="search_val"
               @keyup.enter="search"
               @input="oninput"
               @focus="onfocus"
               @blur="onblur"
               :placeholder="placeholder">
        <v-btn @click="search"
               color="#71C5FF"
               :loading="isAjax"
               depressed
        >
            <fa icon="search"></fa>
        </v-btn>

        <transition name="fade">
            <div class="search_results" v-if="showResults">
                <div class="no_result"  v-if="results.length===0">
                    <p class="icon"><fa icon="snowman"></fa></p>
                    <p>No Results Found</p>
                </div>
                <search-result class="search_result" v-for="res in results" :key="res.data.id" :item="res" @click="onselect(res)"></search-result>
            </div>
        </transition>
    </div>
</template>
<script>
    import Vue from "vue";
    import axios from "@/axios";
    import SearchResult from "@/components/misc/SearchBar/SearchResult";

    export default Vue.extend({
        components: {
            SearchResult
        },
        data(){
            return{
                showResults: false,
                results: [],
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
            onselect(item){
                this.showResults = false;
            },
            onblur(){
                console.log("BLUR");
                this.showResults = false;
            },
            onfocus(){
                console.log("FOCUS");
                this.showResults = true;
            },
            search(){
                if(!this.canSearch) return;
                this.$emit('search', this.search_val);
            },
            oninput(){
                this.$emit('input', this.search_val);
                this.autoSearch();
            },

            autoSearch(){
                let query = this.search_val;
                let parent = this;
                const SEARCH_LIM = 5;

                if(query === ''){
                    this.showResults = false;
                    return;
                }

                console.log(`Searching: ${query}`);
                axios.get(`/x/search?query=${query}&limit=${SEARCH_LIM}`).then(res => {
                    let data = res.data;
                    parent.showResults = true;
                    parent.results = data.results;
                    console.log(data);
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
<style scoped lang="scss">
    .search_bar{
        display: flex;
        background-color: transparent;
        /*overflow: hidden;*/
        position: relative;
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


    .search_results{
        position: absolute;
        width: 100%;
        box-sizing: border-box;
        border-radius: 2px;
        background-color: #fff;
        top: calc(100% + 4px);
        left: 0px;
        font-size: 12px;
        color: #333;
        border: 1px solid #d2d2d2;
        box-shadow: 2px 2px 5px rgba(0,0,0,0.1);
        & :last-child{
            border: none !important;
        }
    }


    .no_result{
        padding: 10px 30px;
        display: flex;
        align-items: center;

        .icon{
            font-size: 26px;
            margin-right: 15px;
            opacity: 0.4;
        }
    }
    .search_result{
        border-bottom: 1px solid #d2d2d2;
        cursor: pointer;
    }


    .fade-enter-active, .fade-leave-active {
        transition: opacity .3s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }
</style>
