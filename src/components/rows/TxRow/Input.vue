<template>
    <div>
        <div class="from" v-for="addr in addresses" :key="addr">
            <p class="bold" ><b>From</b></p>
            <router-link class="addr" :to="`/address/${addr}`">{{addr | address}}</router-link>
        </div>
    </div>
</template>
<script>
    import { addressMap } from "@/helper";

    export default {
        filters: {
            address(val){
                return addressMap(val);
            }
        },
        props: {
            input: {
                type: Object,
                required: true
            }
        },
        mounted() {
            // console.log(this.input);
        },
        computed: {
            addresses(){
                let res = this.input.output.addresses;
                return res;
            },
        }
    }
</script>
<style scoped lang="scss">
    .from{
        display: grid;
        grid-template-columns: max-content 1fr max-content;
        white-space: nowrap;
        overflow: hidden;
        margin-bottom: 5px;

        .bold{
            padding: 4px 0px;
            text-align: right;
            padding-right: 2px;
        }

        .addr{
            text-overflow: ellipsis;
            overflow: hidden;
            padding-left: 0;
            color: #7A838E !important;
            font-family: monospace;
            text-decoration: none;
        }
        .addr:hover{
            text-decoration: underline;
        }
        p, a{
            padding: 4px 12px;
        }
    }
</style>
