<template>
    <div class="network_menu" :connected="status==='connected'" @keydown.esc="closeMenu">
        <!-- STATUS BUTTONS -->
        <div class="toggle_but" @click="toggleMenu">
            <img src="@/assets/network_on.png" v-if="status === 'connected'">
            <img src="@/assets/network_off.png" v-else>
            <button v-if="status === 'connected'" class="but_primary">{{activeNetwork.name}}</button>
            <button v-else-if="status === 'connecting'">Connecting...</button>
            <button v-else>Disconnected</button>
        </div>
        
        <!-- MODAL -->
        <transition-group name="fade">            
            <div class="network_body" v-if="isModalOpen" key="body">
                <!-- MODAL HEADER -->
                <div class="header">
                    <template v-if="page==='list'">
                        <h4>Networks</h4>
                        <!-- <button @click="viewCustom">Add Custom</button> -->
                    </template>
                    <template v-if="page==='custom'">
                        <h4>Add Custom Network</h4>
                        <button @click="viewList" style="background-color: transparent; color: #3a3144">Cancel</button>
                    </template>
                    <template v-if="page==='edit'">
                        <h4>Edit Network</h4>
                        <button @click="viewList" style="background-color: transparent; color: #3a3144">Cancel</button>
                    </template>
                </div>
                <!-- MODAL CONTENT -->
                <transition name="fade" mode="out-in">
                    <ListPage v-if="page==='list'"></ListPage>
                    <!-- <CustomPage v-if="page==='custom'" @add="addCustomNetwork"></CustomPage> -->
                    <!-- <EditPage v-if="page==='edit'" :net="editNetwork" ></EditPage> -->
                </transition>
            </div>
            <!-- BACKGROUND -->
            <div class="network_dispose_bg" v-if="isModalOpen" key="bg" @click="closeMenu"></div>
        </transition-group>
    </div>
</template>
<script lang="ts">
    import 'reflect-metadata';
    import { Vue, Component, Prop } from 'vue-property-decorator';
    import Network from "@/js/Network"; 
    import ListPage from './ListPage.vue';
    // import CustomPage from './CustomPage.vue';
    // import EditPage from "@/components/NetworkSettings/EditPage.vue";

    @Component({
        components: {
            ListPage,
            // CustomPage,
            // EditPage
        }
    })
    export default class NetworkMenu extends Vue {
        page: string = "list";  // list, custom, edit
        isModalOpen: boolean = false; 
        editNetwork: Network | null = null;

        toggleMenu(): void {
            this.isModalOpen = !this.isModalOpen;
        }

        viewCustom(): void {
            this.page = "custom";
        }
        
        viewList(): void {
            this.page = "list";
        }
        
        closeMenu(): void {
            this.page = "list";
            this.isModalOpen = false;
        }
        
        addCustomNetwork(data: Network): void{
            this.$store.commit("Network/addNetwork", data);
            this.page = "list";
        }
        
        onedit(network: Network): void {
            this.editNetwork = network;
            this.page = "edit";
        }

        get status(): string{
            console.log("this.$store.state.Network.status", this.$store.state.Network.status);
            return this.$store.state.Network.status;
        }
        
        get activeNetwork(): Network | null {
            console.log("this.$store.state.Network.selectedNetwork", this.$store.state.Network.selectedNetwork)
            return this.$store.state.Network.selectedNetwork;
        }
        
        get networks(): Network {
            console.log("this.$store.state.Network.networks", this.$store.state.Network.networks)
            return this.$store.state.Network.networks;
        }
    }
</script>
<style scoped lang="scss">
    @use '../../main';

    .network_menu {
        position: relative;
    }

    .toggle_but {
        display: flex;
        color: main.$primary-color-light;
        min-width: 140px;
        margin-right: 30px;

        img {
            max-height: 24px;
            object-fit: contain;
            margin-right: 5px;
        }

        button {
            font-size: 16px;
            color: main.$primary-color;
            background-color: main.$white;
        }
    }

    .network_dispose_bg {
        position: fixed;
        z-index: 1;
        left: 0;
        top: 0;
        width: 100vw;
        height: 100vh;
        background-color: main.$white;
        opacity: 0.54;
    }

    .network_body {
        position: fixed;
        z-index: 2;
        top: 31px;
        right: 16px;
        border-radius: 4px;
        background-color: #fff;
        box-shadow: 2px 2px 10px rgba(0,0,0,0.4);
    }

    .header {
        border-bottom: 1px solid main.$gray-light;
        padding: 10px 15px;
        display: flex;
        
        h4 {
            flex-grow: 1;
            margin: 0;
            color: main.$primary-color;
        }

        button {
            background-color: main.$secondary-color;
            color: #fff;
            font-size: 12px;
            padding: 3px 14px;
            border-radius: 4px;
        }
    }

    .network_menu[connected] {
        .toggle_but {
            color: main.$primary-color;
        }
    }

    @include main.device_xs {
        .network_body {
            position: fixed;
            width: 100vw;
            z-index: 2;
            right: 0 !important;
            left: 0 !important;
        }
    }

    @include main.device_s {
        .toggle_but{
            min-width: auto;
        }
    }
</style>
