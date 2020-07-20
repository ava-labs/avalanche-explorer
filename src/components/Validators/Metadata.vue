<template>
    <div class="card meta_data">
        <div class="header">
            <h2>
                Validators
                <TooltipHeading
                    content="A validator is a node participating in the consensus protocol. Validators work together to achieve consensus as to which transactions have taken place on a blockchain."
                ></TooltipHeading>
            </h2>
            <v-tabs
                class="tabs"
                @change="typeChange"
                active-class="tab_active"
                height="32"
                hide-slider
            >
                <v-tab>Active</v-tab>
                <v-tab>Pending</v-tab>
            </v-tabs>
        </div>
        <div class="stats">
            <article>
                <img src="@/assets/ava_price-purple.png" />
                <div class="stat">
                    <p class="label">
                        Total {{toggle}} Stake
                        <TooltipMeta
                            content="total value of scarce resource ($AVAX) used to secure the Avalanche network using the Proof-of-Stake method"
                        ></TooltipMeta>
                    </p>
                    <p class="meta_val">
                        {{totalStake}}
                        <span class="unit">AVAX</span>
                    </p>
                </div>
            </article>
            <article>
                <img src="@/assets/validators-purple.png" />
                <div class="stat">
                    <p class="label">
                        {{toggle}} Validators
                        <TooltipMeta
                            content="total number of nodes participating in the consensus protocol"
                        ></TooltipMeta>
                    </p>
                    <p class="meta_val">{{totalValidatorsCount.toLocaleString()}}</p>
                </div>
            </article>
        </div>
    </div>
</template>

<script lang="ts">
import "reflect-metadata";
import { Vue, Component, Prop } from "vue-property-decorator";
import { AVALANCHE_SUBNET_ID } from "@/store/modules/platform/platform";
import TooltipHeading from "@/components/misc/TooltipHeading.vue";
import TooltipMeta from "@/components/misc/TooltipMeta.vue";

@Component({
    components: {
        TooltipHeading,
        TooltipMeta
    }
})
export default class Metadata extends Vue {
    toggle: string = "active"; // active | pending

    typeChange(val: string) {
        this.toggle = val ? "pending" : "active";
        this.$emit("toggle", this.toggle);
    }

    get totalStake() {
        let valBig = this.toggle === "active"
            ? this.$store.getters["Platform/totalStake"]
            : this.$store.getters["Platform/totalPendingStake"];
        return valBig.div(Math.pow(10, 9)).toLocaleString();
    }

    get totalValidatorsCount() {
        return this.toggle === "active"
            ? this.$store.getters["Platform/totalValidators"]
            : this.$store.getters["Platform/totalPendingValidators"];
    }
}
</script>

<style scoped lang="scss">
@use "../../main";

.meta_data {
    margin-bottom: 30px;

    .header {
        display: flex;
        justify-content: space-between;
    }
}

.stats {
    display: grid;
    width: 100%;
    grid-template-columns: 1fr 1fr max-content;

    > article {
        padding: 30px 15px 0;
        text-align: left;
        line-height: 1.4em;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    img {
        object-fit: contain;
        width: 40px;
        margin-right: 20px;
    }

    .stat {
        display: flex;
        flex-direction: column;

        p {
            font-weight: 400; /* 700 */
        }

        .label {
            text-transform: capitalize;
            color: main.$primary-color;
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 6px;
        }

        .meta_val {
            font-size: 32px;
            line-height: 1em;

            .unit {
                font-size: 14px;
                opacity: 0.7;
            }
        }
    }
}

@include main.device_s {
    .stats {
        grid-template-columns: 50% 50%;
        grid-template-rows: max-content;

        > div {
            padding: 30px 0 0;
        }

        img {
            width: 24px;
        }

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

@include main.device_xs {
    .meta_data {
        margin-bottom: 10px;
    }

    .stats {
        grid-template-columns: none;

        > article {
            padding: 15px 0 0;
        }

        img {
            display: none;
        }
    }
}

.tabs {
    flex-direction: row-reverse;
    display: inline-block;
    width: max-content;
    flex-grow: 0;
}

.v-tab {
    color: #000 !important;
    border: 2px solid #000;
    background-color: transparent;
    font-size: 13px;
    font-weight: 400; /* 700 */
    letter-spacing: 0;
    margin: 0;
    text-transform: none;

    &:first-child {
        border-radius: 4px 0 0 4px;
    }

    &:last-child {
        border-radius: 0 4px 4px 0;
    }
}

.tab_active {
    background-color: #000;
    color: main.$white !important;
}

@include main.device_s {
    .header {
        flex-direction: column;
    }

    .tabs {
        margin-top: 20px;
        width: 100%;
    }

    .v-tab {
        flex-grow: 1;
    }

    .meta_data {
        grid-template-columns: none;
        grid-template-rows: max-content max-content max-content;

        > div {
            text-align: left;
            padding: 0;
        }
    }
}
</style>
