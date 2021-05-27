export interface IAsset {
    aggregates: any
    alias: string
    chainID: string
    currentSupply: string
    denomination: number
    id: string
    name: string
    nft: number
    symbol: string
    timestamp: string
    variableCap: number
}

export enum AssetType {
    VARIABLE_CAP = 'Variable Cap',
    FIXED_CAP = 'Fixed Cap',
    NFT = 'Non-Fungible Token (NFT)',
}
