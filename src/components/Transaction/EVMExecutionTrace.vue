<template>
    <div id="execution_tree">
        <v-treeview v-model="traces" :items="traces" return-object open-all>
            <template v-slot:prepend="{ item }">
                <div class="trace monospace">
                    <!-- 1 -->
                    <div>
                        <div v-if="item.callType" class="calltype">
                            {{ item.callType }}
                        </div>

                        <div class="type">
                            <template v-if="item.type !== 'call'">{{
                                item.type
                            }}</template>
                        </div>
                    </div>
                    <!-- 2 -->
                    <div class="input">
                        <!-- CONTRACT THAT WAS CALLED -->
                        <a :href="cURL(item.to)" target="_blank">
                            <span class="called_contract">
                                <template v-if="item.name">
                                    {{ item.name }}
                                </template>
                                <template v-else>{{ item.to }}</template>
                            </span>
                        </a>
                        <template v-if="item.input">
                            <!-- SHOW DECODED INPUT -->
                            <template v-if="item.possibleSignatures.length > 0">
                                <div class="methodId_and_input_ref">
                                    <div
                                        v-for="(
                                            sig, i
                                        ) in item.possibleSignatures"
                                        :key="i"
                                        class="methodId"
                                    >
                                        .{{ sig }}
                                    </div>
                                    <div class="input_ref">
                                        {{ item.input }}
                                    </div>
                                </div>
                            </template>
                            <!-- SHOW INPUT AS FALLBACK -->
                            <template v-else>
                                <div class="input_raw">{{ item.input }}</div>
                            </template>
                        </template>
                        <template v-else>undefined</template>
                    </div>
                    <!-- 3 -->
                    <div class="returns">
                        <span> => </span>
                    </div>
                    <!-- 4 -->
                    <div class="output">
                        <template v-if="item.output" class="output_raw">
                            {{ item.output }}
                        </template>
                        <template v-else>undefined</template>
                    </div>
                    <!-- 5 -->
                    <div class="gas_and_value">
                        <div class="gas">
                            <span class="label">GAS</span>
                            {{ parseInt(item.gas).toLocaleString() }}
                        </div>
                        <div v-if="item.value !== '0'" class="value">
                            <span class="label">VALUE</span>
                            {{ item.value }} AVAX
                        </div>
                    </div>
                </div>
            </template>
        </v-treeview>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import 'reflect-metadata'
import {
    cChainExplorerURL,
    cChainExplorerURL_test,
    DEFAULT_NETWORK_ID,
} from '@/store/modules/network/network'

@Component({
    components: {},
    filters: {},
})
export default class EVMExecutionTrace extends Vue {
    @Prop() traces!: any[]

    // get verifiedContracts() {
    //     return this.$store.state.Sources.verifiedContracts
    // }

    // @Watch('verifiedContracts')
    // onVerifiedContracts() {
    //     this.$forceUpdate()
    // }

    cURL(id: string) {
        return `${
            DEFAULT_NETWORK_ID === 1
                ? cChainExplorerURL
                : cChainExplorerURL_test
        }/address/${id}`
    }
}
</script>

<style scoped lang="scss">
$margin: 8.2px;

.monospace {
    font-size: 0.875em;
}

.trace {
    width: 100%;
    display: grid;
    grid-template-columns: 75px auto 35px 1fr 100px;
}

.calltype {
    font-size: 0.75em;
    margin-right: $margin;
}

.type {
    margin-right: $margin;
}

.input,
.output {
    margin-right: $margin;
}

.input_raw,
.input_ref,
.output_raw,
.output_reference {
    word-break: break-all;
}

.input {
    display: flex;
}

.called_contract {
}

.methodId_and_input_ref {
    display: flex;
    flex-direction: column;
}

.input_ref {
    font-size: 0.75em;
}

.returns {
    margin: 0 $margin;
}

.gas_and_value {
    .label {
        font-size: 0.75em;
    }
}
</style>
<style lang="scss">
#execution_tree {
    .v-treeview-node__prepend {
        width: 100%;
    }
}
</style>
