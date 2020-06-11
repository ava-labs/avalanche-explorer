<template>
    <div class="pagination_control">
        <button @click="page=1" :class="{
            'disabled': page==1
        }">First</button>
        <button @click="pageDown" :class="{
            'disabled': page==1
        }">&#60;</button>
        <p class="disabled">Page <b>{{page}}</b> of <b>{{totalPages}}</b></p>
        <button @click="pageUp" :class="{
            'disabled': page==totalPages
        }">&#62;</button>
        <button @click="page=totalPages" :class="{
            'disabled': page==totalPages
        }">Last</button>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                page: 1
            }
        },
        watch: {
            page(val){
                console.log("Page: ",val);
                let offset = (val-1) * this.limit;
                this.$emit('change', offset);
            }
        },
        props: {
            total: {
                type: Number,
                default: 0
            },
            limit: {
                type: Number,
            }
        },
        computed: {
            totalPages(){
                return Math.ceil(this.total / this.limit);
            }
        },
        methods: {
            pageUp(){
                let page = this.page+1;

                if(page > this.totalPages) return;
                this.page = page;
            },
            pageDown(){
                let page = this.page-1;

                if(page < 1) return;
                this.page = page;
            }
        }
    }
</script>
<style scoped lang="scss">
@use '../../main';

    .pagination_control{
        display: flex;

        > *{
            background-color: #E6F5FF;
            color: #000;
            border: none;
            margin: 0px 2px;
            padding: 6px 12px;
            border-radius: 4px;
            color: main.$primary-color;
        }
    }

    button{
        outline: none;
    }

    .disabled{
        color: #7A838E;
    }
</style>
