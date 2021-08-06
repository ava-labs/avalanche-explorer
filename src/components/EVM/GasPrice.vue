<template>
    <p class="gasPrice">{{ denominatedPrice }} <NativeSymbol /></p>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import NativeSymbol from '@/components/misc/NativeSymbol.vue'
import Big from 'big.js'

@Component({
    components: {
        NativeSymbol,
    },
})
export default class GasPrice extends Vue {
    @Prop() price!: Big

    get denominatedPrice(): string {
        return this.price.div(Math.pow(10, 18)).toLocaleString(18)
    }
}
</script>

<style scoped lang="scss"></style>
