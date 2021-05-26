import { IAggregate } from '@/services/aggregates/'

export interface IAssetDataOrtelius {
    id: string
    alias: string
    chainID: string
    currentSupply: string
    denomination: number
    name: string
    symbol: string
    timestamp: string
    variableCap: number
    nft: number
    aggregates: IAggregate | null
}

export interface IAssetDataAvalancheGo {
    assetID: Uint8Array
    denomination: number
    name: string
    symbol: string
}

export interface ICollisionMap {
    [key: string]: string[]
}
