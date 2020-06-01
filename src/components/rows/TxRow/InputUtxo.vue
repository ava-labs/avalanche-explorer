<template>
    <div>
        <div class="from" v-for="addr in addresses" :key="addr">
            <router-link class="addr ava-monospace" :to="`/address/${addr}`">{{addr | address}}</router-link>
        </div>
    </div>
</template>

<script>
import { addressMap } from "@/helper";

export default {
    filters: {
        address(val) {
            return addressMap(val);
        }
    },
    props: {
        input: {
            type: Object,
            required: true
        }
    },
    computed: {
        addresses() {
            let res = this.input.output.addresses;
            return res;
        }
    }
};
</script>

<style scoped lang="scss">
.from {
    display: grid;
    grid-template-columns: max-content 1fr max-content;
    white-space: nowrap;
    overflow: hidden;
    margin-bottom: 5px;

    .addr {
        text-overflow: ellipsis;
        overflow: hidden;
        padding-left: 0;
        color: #7a838e !important;
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }
    
    p, a {
        padding: 4px 12px;
    }
}
</style>
