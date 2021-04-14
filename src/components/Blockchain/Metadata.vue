<template>
    <section class="stats">
        <article class="meta_row">
            <p class="label">Name</p>
            <p class="blockchain">
                <span>{{ blockchain.name }}</span>
            </p>
        </article>
        <article class="meta_row">
            <p class="label">ID</p>
            <p class="blockchain">
                <span>{{ blockchain.id }}</span>
            </p>
        </article>
        <article class="meta_row">
            <p class="label">Subnet</p>
            <p class="blockchain">
                <span>{{ blockchain.subnetID }}</span>
            </p>
        </article>
        <article class="meta_row">
            <p class="label">Validators</p>
            <p class="blockchain">
                <span>{{ validatorsCount }}</span>
            </p>
        </article>
        <article class="meta_row">
            <p class="label">VM ID</p>
            <p class="blockchain">
                <span>{{ blockchain.vmID }}</span>
            </p>
        </article>
        <article class="meta_row">
            <p class="label">Indexed</p>
            <p class="blockchain">
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
