<template>
    <div class="evm_log_row">
        <section class="stats meta">
            <article class="meta_row">
                <p class="meta_label">
                    Address
                    <Tooltip
                        content="The smart contract that emitted this event"
                    />
                </p>
                <div class="meta_value values">
                    <router-link :to="`/evmaddress/${log.address}`">{{
                        log.address
                    }}</router-link>
                </div>
            </article>
            <article v-if="decodedLog" class="meta_row">
                <p class="meta_label">
                    Name
                    <Tooltip content="The decoded name of this event" />
                </p>
                <div class="meta_value values">
                    <div class="method_id monospace">
                        <span class="margin-right">{{ decodedLog.name }}</span>
                        <span>(</span>
                        <div v-for="(event, i) in decodedLog.events" :key="i">
                            <span v-if="i === 0" class="index_topic"
                                >index_topic_1
                            </span>
                            <span v-if="i === 1" class="index_topic"
                                >index_topic_2
                            </span>
                            <span class="arg_name">{{ event.name }} </span>
                            <span class="arg_type">{{ event.type }}</span>
                            <span
                                v-if="i < decodedLog.events.length - 1"
                                class="margin-right"
                                >,
                            </span>
                        </div>
                        <span>)</span>
                    </div>
                </div>
            </article>
            <article class="meta_row">
                <p class="meta_label">
                    Topics
                    <Tooltip
                        content="Topics are indexed values emitted in the event, which can be used to efficiently search the blockchain"
                    />
                </p>
                <div class="meta_value values">
                    <div v-if="log.topics[0]" class="topic">
                        <div>0</div>
                        <div class="monospace">{{ log.topics[0] }}</div>
                    </div>
                    <div v-if="log.topics[1]" class="topic">
                        <div>1</div>
                        <div class="monospace">{{ log.topics[1] }}</div>
                    </div>
                    <div v-if="log.topics[2]" class="topic">
                        <div>2</div>
                        <div class="monospace">{{ log.topics[2] }}</div>
                    </div>
                </div>
            </article>
            <article v-if="log.data" class="meta_row">
                <p class="meta_label">
                    Data
                    <Tooltip
                        content="Non-indexed values emitted in the event"
                    />
                </p>
                <div class="meta_value values monospace">
                    {{ log.data }}
                </div>
            </article>
        </section>
    </div>
</template>
<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import Tooltip from '@/components/rows/Tooltip.vue'

@Component({
    components: { Tooltip },
})
export default class EVMLogRow extends Vue {
    @Prop() log!: any

    decodedLog: any = null

    @Watch('abisLoaded')
    async onAbisLoadedChanged() {
        const isDecoded = this.$store.state.abiDecoder.decodeLogs([this.log])
        if (isDecoded !== [undefined]) {
            this.decodedLog = isDecoded[0]
        }
    }

    get abisLoaded() {
        return this.$store.state.abisLoaded
    }
}
</script>
<style scoped lang="scss">
.meta {
    .meta_row {
        padding: 5px 0;
    }
}
.evm_log_row {
    padding: 15px 0;
    border-bottom: 1px solid $gray;
}

.topic {
    display: flex;

    :first-of-type {
        margin-top: 2px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 12px;
        min-width: 20px;
        margin-right: 10px;
    }
}

.method_id {
    display: flex;
}

.index_topic {
    color: $primary-color-light;
}
.arg_name {
    color: $green;
}

.arg_type {
    color: $secondary-color;
}
.margin-right {
    margin-right: 5px;
}

.monospace {
    padding-top: 3px;
    font-size: 0.9rem;
}
</style>
