<template>
    <section class="meta">
        <article class="meta_row">
            <p class="meta_label">Name</p>
            <p class="meta_value">
                <span>{{ blockchain.name }}</span>
            </p>
        </article>
        <article class="meta_row">
            <p class="meta_label">ID</p>
            <p class="meta_value">
                <span>{{ blockchain.id }}</span>
            </p>
        </article>
        <article class="meta_row">
            <p class="meta_label">Subnet</p>
            <p class="meta_value">
                <span>{{ blockchain.subnetID }}</span>
            </p>
        </article>
        <article class="meta_row">
            <p class="meta_label">Validators</p>
            <p class="meta_value">
                <span>{{ validatorsCount }}</span>
            </p>
        </article>
        <article class="meta_row">
            <p class="meta_label">VM ID</p>
            <p class="meta_value">
                <span>{{ blockchain.vmID }}</span>
            </p>
        </article>
        <article class="meta_row">
            <p class="meta_label">Indexed</p>
            <p class="meta_value">
                <Indexed
                    :indexed="blockchain.indexed"
                    :not-indexed-label="true"
                />
            </p>
        </article>
    </section>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import Blockchain from '@/js/Blockchain'
import Indexed from '@/components/Blockchain/Indexed.vue'

@Component({
    components: {
        Indexed,
    },
})
export default class Metadata extends Vue {
    @Prop() blockchain!: Blockchain

    get validatorsCount() {
        return this.$store.state.Platform.subnets[this.blockchain.subnetID]
            .validators.length
    }
}
</script>

<style scoped lang="scss"></style>
