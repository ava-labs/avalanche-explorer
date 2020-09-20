<template>
    <div id="tx_history_statistics">
        <section class="stats">
            <article class="meta">
                <p class="label">Addresses</p>
                <p class="meta_val">{{aggregates.addressCount.toLocaleString()}}</p>
            </article>
            <article class="meta">
                <p class="label">Assets</p>
                <p class="meta_val">{{aggregates.assetCount.toLocaleString()}}</p>
            </article>
        </section>
    </div>
</template>
<script lang="ts">
import "reflect-metadata";
import { Vue, Component, Prop } from "vue-property-decorator";

import axios from "@/axios";
import { stringToBig } from "@/helper";
import TooltipHeading from "../../misc/TooltipHeading.vue";
import TooltipMeta from "../TopInfo/TooltipMeta.vue";
import { AVAX_ID } from "@/store/index";
import { Asset } from '@/js/Asset';
import Big from "big.js";

@Component({
    components: {
        TooltipHeading,
        TooltipMeta
    }
})
export default class NetworkActivity extends Vue {
    @Prop() aggregates!: any;    
}

</script>
<style scoped lang="scss">


#tx_history_statistics {
    margin-top: 30px;
}

.stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    row-gap: 45px;
    column-gap: 30px;
    padding: 4px 0 0;
    flex-wrap: wrap;
    overflow: auto;
    width: 100%;

    .meta {
        display: flex;
        flex-direction: column-reverse;
        flex-wrap: wrap;
        justify-content: flex-start;
        flex-grow: 1;
        text-align: center;
        font-size: 12px;
        font-weight: 700;
        
        p {
            padding: 2px 4px;
            font-weight: 400;
            text-align: center;
            width: 100%;
        }

        .label {
            text-transform: capitalize;
            font-size: 12px;
            font-weight: 300;
            margin-top: 2px;
        }

        .meta_val {
            font-size: 24px;
            line-height: 1em;
            font-weight: 300;

            .unit {
                font-size: 12px;
                opacity: 0.7;
            }
        }
    }
}

@include xsOnly {
    .stats {
        grid-template-columns: 1fr 1fr;

        .stat {
            .label {
                font-size: 13px;
            }

            .meta_val {
                font-size: 20px;

                .unit {
                    font-size: 12px;
                }
            }
        }
    }
}
</style>
