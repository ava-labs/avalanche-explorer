<template>
    <span v-if="assetsLoaded" class="nativeSymbol">{{ nativeSymbol }}</span>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component } from 'vue-property-decorator'
import { AVAX_ID } from '@/known_assets'

@Component({})
export default class NativeSymbol extends Vue {
    get assetsLoaded(): boolean {
        return this.$store.state.assetsLoaded
    }

    get nativeSymbol() {
        return this.$store.state.assets[AVAX_ID].symbol
    }
}
</script>

<style scoped lang="scss"></style>
