<template>
    <div class="metadata">
        <div>
            <div class="meta_data">
                <div>
                    <img src="@/assets/blockchain-purple.png" />
                    <div>
                        <p class="label">
                            Blockchains
                            <TooltipMeta content="total number of blockchains created on thiis subnetwork"></TooltipMeta>
                        </p>
                        <p class="meta_val">{{totalBlockchains}}</p>
                    </div>
                </div>
                <div>
                    <img src="@/assets/validators-purple.png" />
                    <div>
                        <p class="label">
                            Validators
                            <TooltipMeta content="total number of nodes participating in the consensus protocol of this subnetwork"></TooltipMeta>
                        </p>
                        <p class="meta_val">{{totalValidators}}</p>
                    </div>
                </div>
                <div>
                    <img src="@/assets/validators-purple.png" />
                    <div>
                        <p class="label">
                            Pending Validators
                            <TooltipMeta content="total number of nodes waiting to participate in the consensus protocol of this subnetwork"></TooltipMeta>
                        </p>
                        <p class="meta_val">{{totalPendingValidators}}</p>
                    </div>
                </div>
                <div>
                    <img src="@/assets/key-purple.png" />
                    <div>
                        <p class="label">
                            Control Keys
                            <TooltipMeta content="total number of nodes waiting to participate in the consensus protocol of this subnetwork"></TooltipMeta>
                        </p>
                        <p class="meta_val">{{totalControlKeys}}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Big from "big.js";
import TooltipMeta from "../../components/misc/TooltipMeta";

export default {
    components: {
        TooltipMeta
    },
    props: {
        totalBlockchains: Number,
        totalValidators: Number,
        totalPendingValidators: Number,
        totalControlKeys: Number
    }
};
</script>
<style scoped lang="scss">
@use"../../main";

.metadata {
    /* margin-bottom: 30px; */
    background-color: main.$primary-color-light;
    .header {
        display: flex;
        justify-content: space-between;
    }
}

.meta_data {
    display: grid;
    width: 100%;
    grid-template-columns: 25% 25% 25% 25%;

    img {
        object-fit: contain;
        width: 20px;
        margin-right: 15px;
    }

    > div {
        padding: 30px 15px;
        text-align: left;
        line-height: 1.4em;
        display: flex;
        flex-direction: row;
        align-items: center;
        flex-wrap: wrap;
    }

    p {
        font-size: 32px;
        font-weight: bold;
    }

    .label {
        text-transform: capitalize;
        font-size: 13px;
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
