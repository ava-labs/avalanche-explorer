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
            <p>{{stakeAmountText}} AVA</p>
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
import { toAVA } from "../../../helper";
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
            return toAVA(parseInt(val.toString()));
        },
        stakeAmount() {
            return toAVA(this.validator.stakeAmount);
        },
        stakeAmountText() {
            return toAVA(this.validator.stakeAmount).toFixed(9);
        },
        stakePerc() {
            return this.stakeAmount / this.totalStake * 100;
        },
        stakePercText() {            
            // redundant assignments bc referencing computed values affect performance
            let stakeAmount = toAVA(this.validator.stakeAmount);
            let totalStake = toAVA(parseInt(this.$store.getters["Platform/totalStake"].toString()));
            return (stakeAmount / totalStake * 100).toFixed(8);
        },
        cumulativePercText() {
            let cumulativeStake = toAVA(this.cumulativeStake);
            let totalStake = toAVA(parseInt(this.$store.getters["Platform/totalStake"].toString()));
            return (cumulativeStake / totalStake * 100).toFixed(2);
        },
        duration() {
            let dur = this.validator.endTime - this.validator.startTime;
            return moment.duration(dur).humanize();
        },
    }
};
</script>
<style scoped lang="scss">
@use '../../../main';

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
        background-color: #eaecf0;
        color: #000;
        width: 40px;
        height: 40px;
        border-radius: 40px;
        line-height: 40px;
    }

    p {
        width: 100%;
        text-align: center;
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

.amountd {
    width: max-content;
    border-radius: 4px;
    padding: 6px 12px;
    background-color: #e6f5ff;
    color: main.$primary-color;
}

.stake_col {
    p {
        text-align: right;
        padding: 2px 0;

        &:last-of-type {
            font-weight: bold;
        }
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
</style>
