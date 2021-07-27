<template>
    <div>
        <v-treeview v-model="items" :items="items" return-object open-all>
            <template v-slot:prepend="{ item }">
                <div class="test monospace">
                    <div v-if="item.callType" class="calltype">
                        {{ item.callType }} |
                    </div>
                    <div class="type">{{ item.type }}</div>
                    <div class="opening_brace">(</div>

                    <div class="input">
                        <template v-if="item.input">
                            <template v-if="item.possibleSignatures.length > 0">
                                <div
                                    v-for="(item, i) in item.possibleSignatures"
                                    :key="i"
                                >
                                    {{ item }}
                                </div>
                            </template>
                            <div>{{ item.input }}</div>
                        </template>
                        <template v-else>undefined</template>
                    </div>
                    <div class="returns">
                        <span> => </span>
                    </div>
                    <div class="output">
                        <template v-if="item.output">
                            {{ item.output }}
                        </template>
                        <template v-else>undefined</template>
                    </div>
                    <div class="closing_brace">)</div>
                </div>
            </template>
        </v-treeview>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import 'reflect-metadata'

@Component({
    components: {},
    filters: {},
})
export default class EVMExecutionTrace extends Vue {
    @Prop() traces!: any[]

    items: any[] = []

    created() {
        this.items = this.traces
    }
}
</script>

<style scoped lang="scss">
.test {
    display: flex;
    flex-direction: row;
}

.returns {
    margin: 0 8.2px;
}
</style>
