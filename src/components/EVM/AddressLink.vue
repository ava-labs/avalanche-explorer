<template>
    <router-link :to="`/evmaddress/${this.id}`" class="addr monospace">
        <span>{{ abbrevHex[0] }}</span>
        <span class="bold">{{ abbrevHex[1] }}</span>
        <span>{{ abbrevHex[2] }}</span>
        <span class="bold">{{ abbrevHex[3] }}</span>
    </router-link>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { abbreviateHex } from '@/helper'

@Component({})
export default class AddressLink extends Vue {
    @Prop() id!: string

    get abbrevHex() {
        return abbreviateHex(this.id)
    }
}
</script>

<style scoped lang="scss">
.bold {
    font-weight: 700;
}
</style>
