<template>
    <div class="search_bar">
        <input type="text"
               v-model="search_val"
               @keyup.enter="search"
               placeholder="Search by Address / Txn Hash ">
        <v-btn @click="search"
               color="#404040"
               :disabled="!canSearch"
               :loading="isAjax"
        >
            <fa icon="search"></fa>
        </v-btn>
    </div>
</template>
<script>
    import Vue from "vue";

    export default Vue.extend({
        data(){
            return{
                isAjax: false,
                search_val : '',
            }
        },
        methods: {
            search(){
                if(!this.canSearch) return;

                this.isAjax = true;
                console.log(`Searching ${this.search_val}`)
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
        background-color: #303030;
        border-radius: 4px;
        overflow: hidden;
    }

    input{
        background-color: transparent;
        border: none;
        color: #d2d2d2;
        padding: 8px 13px;
        flex-grow: 1;
        outline: none;
        font-size: 13px;
    }

    .v-btn{
        border: none;
        border-radius: 0;
        cursor: pointer;
        font-size: 12px;
        border-left: 1px solid #d2d2d2;
    }
</style>