export interface IRootState {
    assets: any,
    assetsLoaded: boolean,
    chainId: string,
    known_addresses: {
        [key:string]: string
    }
}
