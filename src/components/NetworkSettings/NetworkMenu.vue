<template>
    <div
        class="network_menu"
        :connected="status === 'connected'"
        @keydown.esc="closeMenu"
    >
        <!-- STATUS BUTTONS -->
        <div class="toggle_but" @click="toggleMenu">
            <img
                v-if="status === 'connected'"
                :src="require(`@/assets/network_on_${networkColor}.png`)"
            />
            <img
                v-else
                :src="require(`@/assets/network_off_${networkColor}.png`)"
            />
            <button v-if="status === 'connected'" class="but_primary">
                {{ activeNetwork.name }}
            </button>
            <button v-else-if="status === 'connecting'">Connecting...</button>
            <button v-else>Disconnected</button>
            <fa class="caret" icon="angle-down"></fa>
        </div>
        <!-- MODAL -->
        <transition-group name="fade">
            <div v-if="isModalOpen" key="body" class="network_body">
                <div class="header">
                    <template v-if="page === 'list'">
                        <h4>Switch Networks</h4>
                    </template>
                    <!-- custom/edit headers removed -->
                </div>
                <transition name="fade" mode="out-in">
                    <ListPage v-if="page === 'list'" />
                    <!-- custom/edit pages removed -->
                </transition>
            </div>
            <!-- BACKGROUND -->
            <div
                v-if="isModalOpen"
                key="bg"
                class="network_dispose_bg"
                @click="closeMenu"
            ></div>
        </transition-group>
    </div>
</template>
<script lang="ts">
import 'reflect-metadata'
import { Vue, Component } from 'vue-property-decorator'
import Network from '@/js/Network'
import ListPage from './ListPage.vue'
import { DEFAULT_NETWORK_ID } from '@/store/modules/network/network'

@Component({
    components: {
        ListPage,
    },
})
export default class NetworkMenu extends Vue {
    page = 'list' // list, custom, edit (disabled)
    isModalOpen = false

    toggleMenu(): void {
        this.isModalOpen = !this.isModalOpen
    }

    viewList(): void {
        this.page = 'list'
    }

    closeMenu(): void {
        this.page = 'list'
        this.isModalOpen = false
    }

    get status(): string {
        return this.$store.state.Network.status
    }

    get activeNetwork(): Network | null {
        return this.$store.state.Network.selectedNetwork
    }

    get networks(): Network {
        return this.$store.state.Network.networks
    }

    get networkColor(): string {
        return DEFAULT_NETWORK_ID === 1 ? 'primary' : 'white'
    }
}
</script>
<style scoped lang="scss">
.network_menu {
    position: relative;
    display: flex;
    justify-content: center;
}

.toggle_but {
    display: flex;
    justify-content: center;
    align-items: center;
    color: $primary-color-light;
    min-width: 140px;

    img {
        max-height: 24px;
        object-fit: contain;
        margin-right: 5px;
    }

    button {
        font-size: 16px;
        color: $primary-color;
        background-color: transparent;
    }

    .caret {
        padding-left: 5px;
    }
}

@if $VUE_APP_DEFAULT_NETWORKID == 5 {
    .toggle_but {
        .caret,
        button {
            color: $white;
        }
    }

    .network_menu[connected] .toggle_but {
        color: $white;
    }
}

.network_body {
    position: absolute;
    z-index: 10000;
    top: 9px;
    left: -155px;
    border-radius: 4px;
    background-color: #fff;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.4);
    font-size: 16px;

    .header {
        border-bottom: 1px solid $gray-light;
        padding: 10px 15px;
        display: flex;

        h4 {
            flex-grow: 1;
            margin: 0;
            color: $primary-color;
            font-weight: 500;
            font-size: 22px;
        }

        button {
            background-color: $secondary-color;
            color: #fff;
            font-size: 12px;
            padding: 3px 14px;
            border-radius: 4px;
        }
    }
}

.network_dispose_bg {
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    background-color: $white;
    opacity: 0.54;
}

.network_menu[connected] {
    .toggle_but {
        color: $primary-color;
    }
}

@include smOrSmaller {
    @if $VUE_APP_DEFAULT_NETWORKID == 5 {
        .toggle_but {
            .caret,
            button {
                color: $primary-color-light;
            }
        }

        .network_menu[connected] .toggle_but {
            color: $primary-color-light;
        }
    }

    .network_body {
        top: 0;

        .header {
            padding: 16px 15px;
        }
    }

    .network_menu {
        padding-right: 24px;
    }

    .toggle_but {
        img {
            max-height: 18px;
            margin-right: 3px;
        }

        button {
            font-size: 12px;
        }

        min-width: auto;
    }
}

@include xsOrSmaller {
    .network_body {
        position: fixed;
        width: 100vw;
        z-index: 2;
        right: 0 !important;
        left: 0 !important;
    }
}

@include xxs {
    .toggle_but {
        img {
            display: none;
        }

        button {
            text-align: right;
        }
    }
}
</style>
