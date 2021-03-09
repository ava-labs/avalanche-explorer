<template>
    <div v-if="credentials">
        <div class="utxo_label">Signature</div>
        <p
            v-for="(credential, i) in credentials"
            :key="i"
            class="monospace signature"
        >
            {{ credential.signature }}>
        </p>
    </div>
</template>

<script lang="ts">
import { CredentialResponse } from '@/store/modules/transactions'
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class UtxoCredentials extends Vue {
    @Prop() credentials!: CredentialResponse
}
</script>

<style scoped lang="scss"></style>
