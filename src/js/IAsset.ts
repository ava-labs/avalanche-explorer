export interface IAssetData_Ortelius {
    id: string;
    alias: string;
    chainID: string;
    currentSupply: string;
    denomination: number;
    name: string;
    symbol: string;
}

export interface IAssetData_Avalanche_Go {
    assetID: Uint8Array
    denomination: number
    name: string
    symbol: string
} 

export interface ICollisionsMap {
    [key: string] : string[]
}
