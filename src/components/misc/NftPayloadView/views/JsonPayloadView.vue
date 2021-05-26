<template>
    <div v-if="!isGeneric" class="json_payload_view">
        <textarea v-model="val" cols="30" row="200" disabled></textarea>
    </div>
    <GenericPayloadView v-else :payload="payload"></GenericPayloadView>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { JSONPayload } from 'avalanche/dist/utils'
import GenericPayloadView from '@/components/misc/NftPayloadView/views/GenericPayloadView.vue'

@Component({
    components: {
        GenericPayloadView,
    },
})
export default class JsonPayloadView extends Vue {
    @Prop() payload!: JSONPayload
    val = ''

    @Watch('payload')
    onPayloadChange() {
        this.updateText()
    }

    mounted() {
        this.updateText()
    }

    updateText() {
        this.val = this.jsonText
    }

    get jsonText() {
        try {
            return JSON.stringify(JSON.parse(this.text), undefined, 4)
        } catch (e) {
            return this.text
        }
    }

    get text(): string {
        return this.payload.getContent().toString()
    }

    get isGeneric() {
        try {
            return Object.prototype.hasOwnProperty.call(
                JSON.parse(this.text),
                'avalanche'
            )
                ? true
                : false
        } catch (e) {
            return false
        }
    }
}
</script>
<style scoped lang="scss">
.json_payload_view {
    overflow: scroll;
}

textarea {
    display: block;
    padding: 12px;
    width: 100%;
    height: 100%;
    min-height: 140px;
    font-size: 12px !important;
    background-color: #000 !important;
    font-family: monospace !important;
    color: #0f0 !important;
    resize: none;
    border: none !important;
}

p {
    font-size: 13px;
    padding: 12px 24px;
    word-break: break-word;
    overflow: scroll;
    background-color: var(--bg-light);
    color: var(--primary-color);
}
</style>
