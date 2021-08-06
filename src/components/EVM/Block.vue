<template>
    <div>
        <template v-if="link">
            <router-link :to="`/evmblock/${number}`">{{ number }}</router-link>
        </template>
        <template v-else>{{ number }}</template>
        <div class="block_link">
            <router-link v-if="number > 0" :to="`/evmblock/${number - 1}`">
                <v-tooltip top>
                    <template v-slot:activator="{ on }">
                        <fa icon="arrow-left" color="#c4c4c4" v-on="on"></fa>
                    </template>
                    <div>
                        <p>
                            {{ number - 1 }}
                        </p>
                    </div>
                </v-tooltip>
            </router-link>
        </div>
        <div class="block_link">
            <router-link :to="`/evmblock/${number + 1}`">
                <v-tooltip top>
                    <template v-slot:activator="{ on }">
                        <fa icon="arrow-right" color="#c4c4c4" v-on="on"></fa>
                    </template>
                    <div>
                        <p>
                            {{ number + 1 }}
                        </p>
                    </div>
                </v-tooltip>
            </router-link>
        </div>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class Block extends Vue {
    @Prop() number!: any
    @Prop() link?: boolean
}
</script>

<style scoped lang="scss">
.detail a {
    display: inline-block;
}

.block_link {
    display: inline-block;
    line-height: 1em;

    &:first-of-type {
        margin-left: 30px;
        margin-right: 30px;
    }
}
</style>
