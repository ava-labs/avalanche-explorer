import Network from '@/js/Network'

export interface INetworkState {
    status: NetworkStatus
    networks: Network[]
    selectedNetwork: null | Network
}

type NetworkStatus = 'disconnected' | 'connecting' | 'connected'

export interface INetworkItem {
    name: string
    url: string
    protocol: string
    port: number
    networkId: number
    chainId: string
}
