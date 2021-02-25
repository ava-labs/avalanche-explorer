<template>
    <div>
        <div class="from">
            <span v-if="$vuetify.breakpoint.smAndDown" class="label">From</span>
            <router-link class="addr" :to="`/address/X-${input.address}`">{{
                input.displayAddress
            }}</router-link>
        </div>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { DisplayAddress } from '@/js/Transaction'

@Component({
    filters: {},
})
export default class InputUTXO extends Vue {
    @Prop() input!: DisplayAddress[]
}
</script>

<style scoped lang="scss">
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
        text-decoration: none;
        max-width: 250px;
        word-break: break-all;

        &:hover {
            text-decoration: underline;
        }
    }

    p,
    a {
        padding: 4px 12px;
    }
}

@include smOnly {
    .from {
        .addr {
        }
    }
}

@include xsOnly {
    .from {
        margin-bottom: 0;

        .addr {
            padding-left: 0;
        }
    }
}
</style>
