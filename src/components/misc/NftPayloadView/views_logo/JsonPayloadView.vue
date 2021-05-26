<template>
    <LogoFallback v-if="!isGeneric"></LogoFallback>
    <GenericPayloadViewSmall
        v-else
        :payload="payload"
    ></GenericPayloadViewSmall>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { JSONPayload } from 'avalanche/dist/utils'
import LogoFallback from '@/components/Assets/LogoFallback.vue'
import GenericPayloadViewSmall from '@/components/misc/NftPayloadView/views_logo/GenericPayloadView.vue'

@Component({
    components: {
        GenericPayloadViewSmall,
        LogoFallback,
    },
})
export default class JsonPayloadView extends Vue {
    @Prop() payload!: JSONPayload
    val = ''

    updateText() {
        this.val = this.jsonText
    }

    get jsonText() {
        const data = this.text
        try {
            const obj = JSON.parse(data)
            return JSON.stringify(obj, undefined, 4)
        } catch (e) {
            return data
        }
    }

    get text(): string {
        return this.payload.getContent().toString()
    }

    get isGeneric() {
        const data = this.text
        try {
            if (
                Object.prototype.hasOwnProperty.call(
                    JSON.parse(data),
                    'avalanche'
                )
            ) {
                return true
            } else {
                return false
            }
        } catch (e) {
            return false
        }
    }

    @Watch('payload')
    onPayloadChange() {
        this.updateText()
    }

    mounted() {
        this.updateText()
    }
}
</script>
<style scoped lang="scss"></style>
