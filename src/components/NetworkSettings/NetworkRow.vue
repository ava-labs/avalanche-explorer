<template>
    <a class="network_row" :active="isSelected" :href="explorerFEUrl">
        <img src="@/assets/network_ava.png" />
        <div class="name_col">
            <p class="name">{{network.name}}</p>
            <p class="url">{{endpoint}}</p>
            <!-- <button class="editBut" @click="edit" v-if="!isSelected">
                <fa icon="cog"></fa>Edit
            </button> -->
        </div>
        <div class="status_col">
            <button v-if="!isSelected" @click="select"></button>
            <button v-else-if="!isConnected" class="connecting">Connecting...</button>
            <p class="connected" v-else>Connected</p>
        </div>
    </a>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Vue, Component, Prop } from 'vue-property-decorator';
import Network from '@/js/Network';

@Component({})
export default class NetworkRow extends Vue {
    @Prop() network!: Network;

    get endpoint(): string {
        let net = this.network;
        let portText = "";
        if (net.port) {
            portText = ":" + net.port;
        }
        return `${net.protocol}://${net.ip}${portText}`
    }

    get networkStatus(): string {
        return this.$store.state.Network.status;
    }

    get isConnected(): boolean {
        let state = this.$store.state.Network;
        return (this.network === state.selectedNetwork && this.networkStatus === "connected") ? true : false;
    }

    get isSelected(): boolean {
        let state = this.$store.state.Network;
        return (this.network === state.selectedNetwork) ? true : false;
    }

    edit() {
        // console.log(this.$parent.onedit);
        // console.log(this.$parent.$parent.onedit);
        // console.log(this.$parent.$parent.$parent.onedit);
        // @ts-ignore;
        this.$parent.$parent.$parent.onedit(this.network);
    }

    get explorerFEUrl() {
        let net = this.network;
        return net.explorerFEUrl;
    }

    async select() {
        let net = this.network;
        window.location.href = net.explorerFEUrl;
        
        // try {
        //     let isSel = await this.$store.dispatch('Network/setNetwork', net);

        //     this.$store.dispatch('Notifications/add', {
        //         title: "Network Connected",
        //         message: "Connected to " + net.name,
        //         type: "success"
        //     }, { root: true });

        //     // @ts-ignore;
        //     this.$parent.$parent.isActive = false;
        // } catch (e) {
        //     this.$store.state.Network.selectedNetwork = null;
        //     this.$store.dispatch('Notifications/add', {
        //         title: "Connection Failed",
        //         message: `Failed to connect ${net.name}`,
        //         type: "error"
        //     }, { root: true });
        // }

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
    color: $primary-color;
    font-weight: 700;
}

.name_col {
    line-height: 1em;
    word-break: break-word;
    word-wrap: break-word;
}

.status_col {
    font-size: 14px;
    color: $primary-color;
    text-align: right;
}

/* .editBut {
    color: $primary-color;
    opacity: 0.4;
    font-size: 11px;
    margin-top: 6px;

    &:hover {
        opacity: 0.8;
    }
} */

.connecting {
    animation-name: connecting;
    animation-duration: 0.5s;
    animation-iteration-count: infinite;
    animation-direction: alternate;
}

.url {
    color: $primary-color-light;
    font-size: 12px;
}

button {
    color: $primary-color;
    background-color: $white;
}

@keyframes connecting {
    from {
        color: $primary-color;
    }
    to {
        color: $green;
    }
}

@include xsOnly {
    img {
        display: none;
    }
    .network_row {
        grid-template-columns: 1fr max-content;
    }
}
</style>
