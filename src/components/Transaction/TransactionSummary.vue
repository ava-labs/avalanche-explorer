<template>
    <div v-if="tx" class="card meta">
        <header class="header">
            <h2>
                <p class="type_label monospace">
                    <slot></slot>
                </p>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <p class="click_to_copy">
                            <span
                                class="tx_hash monospace"
                                @click="copy"
                                v-on="on"
                            >
                                {{ tx.id }}
                            </span>
                        </p>
                    </template>
                    <span>Click to copy</span>
                </v-tooltip>
            </h2>
        </header>
        <div class="two_column">
            <!-- SUMMARY -->
            <Metadata :tx="tx" />
            <!-- MEMO & STAKING -->
            <section>
                <article v-if="isText" class="meta_row">
                    <p class="label">
                        Text
                        <Tooltip
                            content="A 256-byte text field for encoding arbitrary data"
                            color="#c4c4c4"
                        />
                    </p>
                    <div>
                        <p><span class="decode">hex</span> {{ text_hex }}</p>
                        <p><span class="decode">UTF-8</span> {{ text_utf8 }}</p>
                    </div>
                </article>
                <article v-if="isStaking" class="meta_row">
                    <p class="label">
                        Staking
                        <Tooltip content="Validator Rewards" color="#c4c4c4" />
                    </p>
                    <StakingSummary :tx="tx" />
                </article>
            </section>
        </div>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import CopyText from '@/components/misc/CopyText.vue'
import UtxoRow from '@/components/Transaction/UtxoRow.vue'
import StakingSummary from '@/components/Transaction/StakingSummary.vue'
import { Transaction } from '../../js/Transaction'
import { getMappingForType } from '@/store/modules/transactions/maps'
import { toAVAX } from '../../helper'
import Tooltip from '@/components/rows/Tooltip.vue'
import Metadata from '@/components/Transaction/Metadata.vue'

@Component({
    components: {
        UtxoRow,
        Tooltip,
        CopyText,
        StakingSummary,
        Metadata,
    },
    filters: {
        getType: getMappingForType,
        toAVAX,
    },
})
export default class TransactionSummary extends Vue {
    @Prop() tx!: Transaction

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

    get text_hex(): string {
        return this.b64DecodeHex(this.tx.memo)
    }

    get text_utf8(): string {
        return this.b64DecodeUnicode(this.tx.memo)
    }

    get isText(): boolean {
        return this.tx.memo === '' || null ? false : true
    }

    get isAssetGenesis(): boolean {
        return this.tx.type === 'create_asset'
    }

    copy() {
        navigator.clipboard.writeText(this.tx.id)
        this.$store.dispatch('Notifications/add', {
            title: 'Copied',
            message: 'Copied to clipoard.',
        })
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
