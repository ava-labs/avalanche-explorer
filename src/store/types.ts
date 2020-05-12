export interface RootState {
    assets: any,
    chainId: string,
    known_addresses: {
        [key:string]: string
    }
}
