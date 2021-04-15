<template>
    <section v-if="blockchain" class="card">
        <header class="header">
            <h2>{{ blockchain.name }} Details</h2>
        </header>
        <Metadata :blockchain="blockchain" />
    </section>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import Blockchain from '@/js/Blockchain'
import Indexed from '@/components/Blockchain/Indexed.vue'
import Metadata from '@/components/Blockchain/Metadata.vue'

@Component({
    components: {
        Indexed,
        Metadata,
    },
})
export default class BlockchainSummary extends Vue {
    @Prop() blockchain!: Blockchain
}
</script>

<style scoped lang="scss"></style>
