<template>
    <div class="evm_log_row">
        <section class="stats meta">
            <article class="meta_row">
                <p class="meta_label">
                    Address
                    <Tooltip content="" />
                </p>
                <div class="meta_value values">
                    <router-link :to="`/evmaddress/${log.address}`">{{
                        log.address
                    }}</router-link>
                </div>
            </article>
            <article v-if="log.topics[0]" class="meta_row">
                <p class="meta_label">
                    Topic 0
                    <Tooltip content="" />
                </p>
                <div class="meta_value values">
                    {{ log.topics[0] }}
                </div>
            </article>
            <article v-if="log.topics[1]" class="meta_row">
                <p class="meta_label">
                    Topic 1
                    <Tooltip content="" />
                </p>
                <div class="meta_value values">
                    {{ log.topics[1] }}
                </div>
            </article>
            <article v-if="log.topics[2]" class="meta_row">
                <p class="meta_label">
                    Topic 2
                    <Tooltip content="" />
                </p>
                <div class="meta_value values">
                    {{ log.topics[2] }}
                </div>
            </article>
            <article v-if="log.data" class="meta_row">
                <p class="meta_label">
                    Data
                    <Tooltip content="" />
                </p>
                <div class="meta_value values">
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
<style scoped lang="scss"></style>
