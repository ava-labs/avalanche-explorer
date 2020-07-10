<template>
    <div class="validator">
        <div class="rank">
            <div>
                <p>{{validator.rank}}</p>
            </div>
        </div>
        <div class="id_col">
            <p>{{validator.id}}</p>
        </div>
        <div class="stake_col">
            <p class="stakeAmount">{{stakeAmountText}} AVAX</p>
            <p>{{stakePercText}}%</p>
        </div>
        <div class="comm_col">
            <p>{{cumulativePercText}}%</p>
            <cumulative-bar
                :total="totalStake"
                :amount="stakeAmount"
                :accumulated="cumulativeStake"
            ></cumulative-bar>
        </div>
    </div>
</template>
<script>
import moment from "moment";
import Big from "big.js";
import { toAVAX } from "../../../helper";
import CumulativeBar from "./CumulativeBar";

export default {
    filters: {
        date(date) {
            let today = new Date();
            let mom = moment(date).fromNow();
            return mom;
        }
    },
    components: {
        CumulativeBar
    },
    props: {
        validator: {
            type: Object,
            required: true
        },
        cumulativeStake: {
            type: Number,
            required: true
        }
    },
    computed: {
        totalStake() {
            let val = this.$store.getters["Platform/totalStake"];
            return toAVAX(parseInt(val.toString()));
        },
        stakeAmount() {
            return toAVAX(this.validator.stakeAmount);
        },
        stakeAmountText() {
            return toAVAX(this.validator.stakeAmount).toFixed(9);
        },
        stakePerc() {
            return this.stakeAmount / this.totalStake * 100;
        },
        stakePercText() {            
            // redundant assignments bc referencing computed values affect performance
            let stakeAmount = toAVAX(this.validator.stakeAmount);
            let totalStake = toAVAX(parseInt(this.$store.getters["Platform/totalStake"].toString()));
            return (stakeAmount / totalStake * 100).toFixed(8);
        },
        cumulativePercText() {
            let cumulativeStake = toAVAX(this.cumulativeStake);
            let totalStake = toAVAX(parseInt(this.$store.getters["Platform/totalStake"].toString()));
            return (cumulativeStake / totalStake * 100).toFixed(0);
        },
        duration() {
            let dur = this.validator.endTime - this.validator.startTime;
            return moment.duration(dur).humanize();
        },
    }
};
</script>
<style scoped lang="scss">
@use"../../../main";

.validator {
    display: grid;
    grid-template-columns: 70px 1fr 1fr 1fr;

    > div {
        text-align: center;
        padding: 10px 15px;
        display: flex;
        justify-content: center;
        flex-direction: column;
    }

    p {
        text-align: left;
        text-overflow: ellipsis;
        font-size: 12px;
        overflow: hidden;
    }
}

.rank {
    > div {
        background-color: main.$white;
        color: #000;
        border: 2px solid main.$primary-color;
        width: 40px;
        height: 40px;
        border-radius: 40px;
        line-height: 40px;
    }

    p {
        width: 100%;
        text-align: center;
        font-weight: 900;
        color: main.$primary-color;
    }
}

.time {
    grid-column: 3/5;

    .display {
        height: 4px;
        position: relative;
        background-color: #dfdfdf;
        border-radius: 3px;
        overflow: hidden;
    }
}

.time_info {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    margin-bottom: 6px;

    > div {
        flex-grow: 1;
    }
    > div:nth-of-type(2) p {
        text-align: center;
    }

    > div:nth-of-type(3) p {
        text-align: right;
    }

    .label {
        font-size: 10px;
    }
}

.label {
    opacity: 0.7;
    font-weight: lighter;
}

.id_col {
    overflow: hidden;
}

.commission_col {
    p {
        text-align: right;
    }
}

.meta_data {
    display: grid;
    width: 100%;
    grid-template-columns: 1fr 1fr 1fr;
    margin-bottom: 30px;

    > div {
        padding: 15px;
        text-align: center;
        line-height: 1.4em;
    }
}

.stake_col {
    p {
        text-align: right;
        padding: 2px 0;

        &:last-of-type {
            font-weight: 400; /* 700 */
        }
    }

    .stakeAmount {
        /* color: main.$pink; */
    }
}

.comm_col {
    position: relative;
    border-right: 1px solid #f0f0f0;
    border-left: 1px solid #f0f0f0;

    p {
        z-index: 2;
        text-align: right;
    }
}
@include main.device_s {
    .validator {
        grid-template-columns: 70px 1fr 1fr 1fr 1fr;
        grid-template-rows: max-content max-content;
    }

    .time {
        grid-column: 1/3;
        grid-row: 2;
    }
}

@include main.device_xs {
    .validator {
        grid-template-columns: 42px 1fr 1fr .5fr;
        grid-template-rows: max-content max-content;

        > div {
            padding: 10px 15px 10px 0;
        }
    }

    .rank > div {
        color: #000;
        border: 2px solid #976cfa;
        width: 24px;
        height: 24px;
        border-radius: 24px;
        line-height: 24px;

        > p {
            font-size: 10px;
        }
    }

    .time {
        grid-column: 1/3;
        grid-row: 2;
    }
}
</style>
