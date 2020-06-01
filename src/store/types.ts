export interface IRootState {
    assets: any,
    chainId: string,
    known_addresses: {
        [key:string]: string
    }
}
