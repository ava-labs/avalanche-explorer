<template>
    <a class="network_row" :active="isSelected" :href="explorerFEUrl">
        <img v-if="isSelected" :src="`img/ava_logo_${logoColor}.png`" />
        <img v-else src="img/ava_logo_black.png" />
        <div class="name_col">
            <p class="name">{{ network.name }}</p>
            <p class="url">{{ endpoint }}</p>
        </div>
        <div class="status_col">
            <button v-if="!isSelected" @click="select"></button>
            <button v-else-if="!isConnected" class="connecting">
                Connecting...
            </button>
            <p v-else class="connected">Connected</p>
        </div>
    </a>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import Network from '@/js/Network'
import { DEFAULT_NETWORK_ID } from '@/store/modules/network/network'

@Component({})
export default class NetworkRow extends Vue {
    @Prop() network!: Network

    get endpoint(): string {
        const net = this.network
        let portText = ''
        if (net.port) {
            portText = ':' + net.port
        }
        return `${net.protocol}://${net.ip}${portText}`
    }

    get networkStatus(): string {
        return this.$store.state.Network.status
    }

    get isConnected(): boolean {
        const state = this.$store.state.Network
        return this.network === state.selectedNetwork &&
            this.networkStatus === 'connected'
            ? true
            : false
    }

    get isSelected(): boolean {
        const state = this.$store.state.Network
        return this.network === state.selectedNetwork ? true : false
    }

    get explorerFEUrl() {
        const net = this.network
        return net.explorerFEUrl
    }

    get logoColor() {
        return DEFAULT_NETWORK_ID === 1 ? 'red' : 'blue'
    }

    async select() {
        const net = this.network
        window.location.href = net.explorerFEUrl
    }
}
</script>
<style scoped lang="scss">
.network_row {
    position: relative;
    padding: 12px 0px;
    display: grid;
    grid-template-columns: 40px 1fr 80px;
    column-gap: 15px;
    border-bottom: 1px solid $gray-light;
    box-sizing: content-box;

    > * {
        align-self: center;
    }

    &:hover {
        text-decoration: none !important;
        opacity: 0.7;
    }
}

.network_row[active] {
    .status_col {
        color: $green !important;
    }
}

.network_link {
    display: flex;
    flex-direction: row;
}

img {
    width: 100%;
    object-fit: contain;
}

.name {
    font-size: 14px;
    font-weight: 500;
}

.name_col {
    line-height: 1em;
    word-break: break-word;
    word-wrap: break-word;
}

.url {
    font-weight: 300;
    font-size: 11px;
}

.status_col {
    font-size: 12px;
    color: $primary-color;
    text-align: center;

    button {
        color: $primary-color;
        background-color: $white;
        font-size: 11px;
        font-weight: 700;
    }
}

.connected {
    padding: 4px 12px;
    border-radius: 20px;
    color: $white;
    background-color: $green;
    min-height: 1em;
    line-height: 2em;
    word-break: keep-all;
    white-space: nowrap;
    font-size: 10px;
    font-weight: 700;
}

.connecting {
    animation-name: connecting;
    animation-duration: 0.5s;
    animation-iteration-count: infinite;
    animation-direction: alternate;
}

@keyframes connecting {
    from {
        color: $primary-color;
    }
    to {
        color: $green;
    }
}

@include xsOrSmaller {
    img {
        display: none;
    }
    .network_row {
        grid-template-columns: 1fr max-content;
    }
}
</style>
