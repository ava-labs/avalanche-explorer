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
    
    // startTime: "2020-09-17T03:00:00Z"
    // endTime: "2020-09-18T03:00:00Z"
    // transactionCount: 426900
    // outputCount: 853765
}

</script>
<style scoped lang="scss">
@use "../../../main";

#tx_history_statistics {
    margin-top: 30px;
}

.stats {
    display: grid;
    grid-template-columns: minmax(0, .75fr) minmax(0, 1fr);
    row-gap: 45px;
    column-gap: 30px;
    padding: 4px 0 0;
    flex-wrap: wrap;
    overflow: auto;
    width: 100%;

    /* hyperlink */
    .meta {
        font-size: 12px;
        display: flex;
        flex-grow: 1;
        justify-content: flex-start;
        flex-wrap: wrap;
        font-weight: 700;
        flex-direction: column-reverse;
        text-align: center;
        
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

@include main.device_s {
    .stats {
        grid-template-columns: 50% 50%;
        grid-template-rows: max-content;

    }
}

@include main.device_xs {
    .stats {
        grid-template-columns: none;

        .stat {
            .label {
                font-size: 13px;
            }

            .meta_val {
                font-size: 20px;

                .unit {
                    font-size: 14px;
                }
            }
        }
    }
}
</style>
