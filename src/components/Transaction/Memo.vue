<template>
    <div>
        <p><span class="decode">hex</span> {{ text_hex }}</p>
        <p><span class="decode">UTF-8</span> {{ text_utf8 }}</p>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Transaction } from '../../js/Transaction'

@Component({
    components: {},
    filters: {},
})
export default class TransactionSummary extends Vue {
    @Prop() tx!: Transaction

    get text_hex(): string {
        return this.b64DecodeHex(this.tx.memo)
    }

    b64DecodeHex(str: string): string {
        const raw = atob(str)
        let result = ''
        for (let i = 0; i < raw.length; i++) {
            const hex = raw.charCodeAt(i).toString(16)
            result += hex.length === 2 ? hex : '0' + hex
        }
        return result.toUpperCase()
    }

    b64EncodeUnicode(str: string): string {
        // first we use encodeURIComponent to get percent-encoded UTF-8,
        // then we convert the percent encodings into raw bytes which
        // can be fed into btoa.
        return btoa(
            encodeURIComponent(str).replace(
                /%([0-9A-F]{2})/g,
                function toSolidBytes(match, p1) {
                    return String.fromCharCode(parseInt('0x' + p1))
                }
            )
        )
    }

    get text_utf8(): string {
        return this.b64DecodeUnicode(this.tx.memo)
    }

    b64DecodeUnicode(str: string): string {
        // Going backwards: from bytestream, to percent-encoding, to original string.
        return decodeURIComponent(
            atob(str)
                .split('')
                .map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                })
                .join('')
        )
    }
}
</script>

<style scoped lang="scss">
.decode {
    display: inline-block;
    color: $primary-color-light;
    width: 60px;
    font-size: 12px;
}
</style>
