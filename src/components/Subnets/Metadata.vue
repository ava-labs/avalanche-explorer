<template>
    <div class="metadata">
        <div class="card">
            <div class="header">
                <h2>
                    Subnets
                    <TooltipHeading content="A Subnet is a set of validators. A Subnet validates a set of blockchains. Each blockchain is validated by exactly one Subnet, which is specified on blockchain creation."></TooltipHeading>
                </h2>
            </div>
            <div class="meta_data">
                <div>
                    <img src="@/assets/subnet-purple.png" />
                    <div>
                        <p class="label">
                            Subnetworks
                            <TooltipMeta content="total number of subnets created on the AVA network"></TooltipMeta>
                        </p>
                        <p class="meta_val">{{totalSubnets.toLocaleString()}}</p>
                    </div>
                </div>
                <div>
                    <img src="@/assets/blockchain-purple.png" />
                    <div>
                        <p class="label">
                            Blockchains
                            <TooltipMeta content="total number of blockchains created on the AVA network"></TooltipMeta>
                        </p>
                        <p class="meta_val">{{totalBlockchains.toLocaleString()}}</p>
                    </div>
                </div>
                <div>
                    <img src="@/assets/validators-purple.png" />
                    <div>
                        <p class="label">
                            Validators
                            <TooltipMeta content="total number of nodes participating in the consensus protocol of the AVA network"></TooltipMeta>
                        </p>
                        <p class="meta_val">{{totalValidators.toLocaleString()}}</p>
                    </div>
                </div>
                <div>
                    <img src="@/assets/ava_price-purple.png" />
                    <div>
                        <p class="label">
                            Total Stake Amount
                            <TooltipMeta content="total value of $AVA tokens used as a scarce resource to secure the AVA network using the Proof-of-Stake method"></TooltipMeta>
                        </p>
                        <p class="meta_val">{{totalStake.toFixed(2)}} AVA</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import TooltipHeading from "../../components/misc/TooltipHeading";
import TooltipMeta from "../../components/misc/TooltipMeta";
import Big from "big.js";

export default {
    components: {
        TooltipHeading,
        TooltipMeta
    },
    props: {
        totalSubnets: Number,
        totalBlockchains: Number,
        totalValidators: Number,
        totalStake: Big
    }
};
</script>
<style scoped lang="scss">
@use '../../main';

.metadata {
    margin-bottom: 30px;

    .header {
        display: flex;
        justify-content: space-between;
    }
}

.meta_data {
    display: grid;
    width: 100%;
    grid-template-columns: 20% 20% 20% 40%;

    img {
        object-fit: contain;
        width: 40px;
        margin-right: 15px;
    }

    > div {
        padding: 30px 15px;
        text-align: left;
        line-height: 1.4em;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    p {
        font-size: 32px;
        font-weight: bold;
    }

    .label {
        text-transform: capitalize;
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 6px;
        opacity: 0.7;
    }

    .meta_val {
        line-height: 1em;
    }
}

@include main.device_s {
    .meta_data {
        grid-template-columns: none;
        grid-template-rows: max-content max-content max-content;

        > div {
            padding: 30px 0 0;
        }
    }
}
</style>
