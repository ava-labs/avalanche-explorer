<template>
    <div class="detail">
        <v-breadcrumbs :items="breadcrumbs" />
        <template v-if="loading">
            <Loader :content-id="blockId" :message="'Fetching Block Details'" />
        </template>
        <template v-else>
            <HTTPError
                v-if="!block"
                :id="blockId"
                :title="'Block Details Not Found'"
                :message="'A record for this block was not found in the Avalanche Explorer'"
                :support-u-r-l="'https://chat.avalabs.org'"
            />
            <template v-else>
                <EVMBlockSummary :block="block"> EVM Block </EVMBlockSummary>
            </template>
        </template>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Component, Watch, Mixins } from 'vue-property-decorator'
import { BlocksGettersMixin } from '@/store/modules/blocks/blocks.mixins'
import { getMappingForType } from '@/store/modules/blocks/maps'
import Loader from '@/components/misc/Loader.vue'
import HTTPError from '@/components/misc/HTTPError.vue'
import EVMBlockSummary from '@/components/Block/EVMBlockSummary.vue'

@Component({
    components: {
        Loader,
        HTTPError,
        EVMBlockSummary,
    },
    filters: {
        getType: getMappingForType,
    },
})
export default class EVMBlockPage extends Mixins(BlocksGettersMixin) {
    loading = false
    breadcrumbs: any = [
        {
            text: 'Home',
            disabled: false,
            href: '/',
        },
        {
            text: 'Blocks',
            disabled: false,
            href: '/', // TODO
        },
        {
            text: 'Detail',
            disabled: true,
            href: '',
        },
    ]

    @Watch('blockId')
    onblockIdChanged() {
        this.getData()
    }

    @Watch('assetsLoaded')
    onAssetsLoaded() {
        this.getData()
    }

    created() {
        this.getData()
    }

    get assetsLoaded() {
        return this.$store.state.assetsLoaded
    }

    get blockId(): string {
        return this.$route.params.id
    }

    get block() {
        return this.getEVMBlock()
    }

    getData(): void {
        this.loading = true
        if (this.assetsLoaded) {
            this.$store
                .dispatch('Blocks/getEVMBlock', this.blockId)
                .then(() => {
                    this.loading = false
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }
}
</script>

<style scoped lang="scss">
.tx_details_error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;

    h2 {
        font-weight: 400;
        font-size: 36px;
        line-height: 1.25em;
    }

    .message {
        margin: 12px 0 0.5em;
        font-size: 16px;
        color: $primary-color;
    }

    .content_id {
        font-size: 16px;
        color: $primary-color-light;
    }

    a {
        display: block;
        width: max-content;
        text-decoration: none !important;
        margin-top: 30px;
        transition: opacity 0.3s;

        background-color: transparent !important;
        color: $secondary-color !important;
        padding: 10px 24px;

        border-radius: 6px;
        font-family: 'Inter', sans-serif;
        font-weight: 700;
        letter-spacing: 0.5px;
        text-transform: uppercase !important;
        font-size: 14px;

        &:hover {
            opacity: 0.9;
        }
    }
}
</style>
