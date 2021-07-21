<template>
    <div class="metadata">
        <div>
            <div class="meta_data">
                <div>
                    <div>
                        <p class="label">
                            Blockchains
                            <TooltipMeta
                                content="Total number of blockchains created on this subnetwork"
                            />
                        </p>
                        <p class="meta_val">
                            {{ totalBlockchains.toLocaleString() }}
                        </p>
                    </div>
                </div>
                <div>
                    <div>
                        <p class="label">
                            Validators
                            <TooltipMeta
                                content="Total number of nodes participating in the consensus protocol of this subnetwork"
                            />
                        </p>
                        <p class="meta_val">
                            {{ totalValidators.toLocaleString() }}
                        </p>
                    </div>
                </div>
                <div>
                    <div>
                        <p class="label">
                            Delegations
                            <TooltipMeta
                                content="Total number of stake delegations to validators"
                            />
                        </p>
                        <p class="meta_val">
                            <template v-if="totalDelegators">
                                {{ totalDelegators.toLocaleString() }}
                            </template>
                            <template v-else>n/a</template>
                        </p>
                    </div>
                </div>
                <div>
                    <div>
                        <p class="label">
                            Control Keys
                            <TooltipMeta
                                content="In order to add a validator to a subnet, threshold signatures from keys are needed"
                            />
                        </p>
                        <p class="meta_val">
                            {{ totalControlKeys.toLocaleString() }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import TooltipMeta from '../../components/misc/TooltipMeta.vue'

@Component({
    components: {
        TooltipMeta,
    },
})
export default class ContentMetadata extends Vue {
    @Prop() totalBlockchains!: number
    @Prop() totalValidators!: number
    @Prop() totalDelegators!: number
    @Prop() totalControlKeys!: number
}
</script>
<style scoped lang="scss">
.metadata {
    margin-bottom: 15px;
    .header {
        display: flex;
        justify-content: space-between;
    }
}

.meta_data {
    display: grid;
    width: 100%;
    grid-template-columns: 25% 25% 25% 25%;

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
        font-weight: 400;
    }

    .label {
        text-transform: capitalize;
        font-size: 12px;
        margin-bottom: 6px;
        color: $primary-color;
    }

    .meta_val {
        font-size: 36px;
        line-height: 1em;
        color: $primary-color;
    }
}

@include smOnly {
    .meta_data {
        grid-template-columns: 50% 50%;

        img {
            display: none;
        }

        > div {
            padding: 30px 0 0;
        }

        .meta_val {
            font-size: 20px;
        }
    }
}
</style>
