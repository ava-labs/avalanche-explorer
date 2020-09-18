<template>
    <div class="network_row" :active="isSelected">
        <img src="@/assets/network_ava.png" />
        <div class="name_col">
            <p class="name">{{network.name}}</p>
            <p class="url">{{endpoint}}</p>
            <!-- <button class="editBut" @click="edit" v-if="!isSelected">
                <fa icon="cog"></fa>Edit
            </button> -->
        </div>
        <div class="status_col">
            <button v-if="!isSelected" @click="select">Select</button>
            <button v-else-if="!isConnected" class="connecting">Connecting...</button>
            <p v-else>Connected</p>
        </div>
    </div>
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
@use '../../main';

.network_row {
    position: relative;
    padding: 12px 0px;
    display: grid;
    grid-template-columns: 40px 1fr 80px;
    column-gap: 15px;
    border-bottom: 1px solid main.$gray-light;
    box-sizing: content-box;

    > * {
        align-self: center;
    }
}

.network_row[active] {
    .status_col {
        color: main.$green !important;
    }
}

img {
    width: 100%;
    object-fit: contain;
}

.name {
    color: main.$primary-color;
}

.name_col {
    line-height: 1em;
    word-break: break-word;
    word-wrap: break-word;
}

.status_col {
    font-size: 14px;
    color: main.$primary-color;
    text-align: right;
}

/* .editBut {
    color: main.$primary-color;
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
    color: main.$primary-color-light;
    font-size: 12px;
}

button {
    color: main.$primary-color;
    background-color: main.$white;
}

@keyframes connecting {
    from {
        color: main.$primary-color;
    }
    to {
        color: main.$green;
    }
}

@include main.xsOnly {
    img {
        display: none;
    }
    .network_row {
        grid-template-columns: 1fr max-content;
    }
}
</style>
