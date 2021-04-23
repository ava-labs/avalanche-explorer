<template>
    <div class="from" :style="{ backgroundColor: backgroundColor }">
        <div class="addr_container">
            <span v-if="$vuetify.breakpoint.smAndDown" class="label">From</span>
            <AddressLink :address="input.displayAddress" />
        </div>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import AddressLink from '@/components/rows/TxRow/AddressLink.vue'
import { DisplayAddress } from '@/js/Transaction'
import { P, X, C } from '@/known_blockchains'

@Component({
    components: {
        AddressLink,
    },
})
export default class InputUTXO extends Vue {
    @Prop() input!: DisplayAddress

    get backgroundColor() {
        let prefix = this.input.displayAddress!.charAt(0)
        switch (prefix) {
            case 'P':
                return P.darkColor
            case 'X':
                return X.darkColor
            case 'C':
                return C.darkColor
            case '0':
                return C.darkColor
        }
    }
}
</script>
<style scoped lang="scss"></style>
