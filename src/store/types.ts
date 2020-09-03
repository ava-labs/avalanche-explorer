export interface IRootState {
    assets: any,
    assetsLoaded: boolean,
    assetAggregatesLoaded: boolean;
    chainId: string,
    known_addresses: {
        [key:string]: string
    }
}
