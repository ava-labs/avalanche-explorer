<template>
    <div>
        <div class="networks_list">
            <NetworkRow
                v-for="net in networks"
                :key="net.id"
                class="network_row"
                :network="net"
            />
        </div>
    </div>
</template>
<script lang="ts">
import 'reflect-metadata'
import { Vue, Component } from 'vue-property-decorator'
import Network from '@/js/Network'
import NetworkRow from './NetworkRow.vue'

@Component({
    components: {
        NetworkRow,
    },
})
export default class ListPage extends Vue {
    get networks(): Network[] {
        return this.$store.state.Network.networks
    }
}
</script>
<style scoped lang="scss">
.networks_list {
    padding: 0 15px;
}

.network_row {
    &:last-child {
        border-bottom: none;
    }
}
</style>
