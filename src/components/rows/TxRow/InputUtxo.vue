<template>
    <div>
        <div class="from" v-for="addr in addresses" :key="addr">
            <span class="label" v-if="$vuetify.breakpoint.smAndDown">From</span>
            <router-link class="addr" :to="`/address/${addr}`">{{addr | address}}</router-link>
        </div>
    </div>
</template>

<script lang="ts">
import "reflect-metadata";
import { Vue, Component, Prop } from "vue-property-decorator";
import { addressMap } from "@/helper";
import { ITransactionInput } from "@/js/ITransaction";

@Component({
    filters: {
        address(val: string): string {
            return addressMap(val);
        }
    }
})

export default class InputUTXO extends Vue {
    @Prop() input!: ITransactionInput;

    get addresses(): string[] {
        return this.input.output.addresses;
    }
}
</script>

<style scoped lang="scss">
@use "../../../main";
.from {
    display: grid;
    grid-template-columns: max-content 1fr max-content;
    white-space: nowrap;
    overflow: hidden;
    margin-bottom: 5px;

    .label {
        font-weight: 400; /* 700 */
        width: 25px;
        padding: 6px 6px 4px 10px;
        opacity: 0.5;
        font-size: 10px;
        text-align: right;
    }

    .addr {
        text-overflow: ellipsis;
        overflow: hidden;
        padding-left: 0;
        color: main.$black !important;
        text-decoration: none;
        max-width: 195px;
        opacity: 0.7;

        &:hover {
            text-decoration: underline;
        }
    }

    p,
    a {
        padding: 4px 12px;
    }
}

@include main.device-xs {
    .from {
        margin-bottom: 0;

        .addr {
            padding-left: 0;
        }
    }
}
</style>
