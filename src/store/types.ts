import { ITransaction } from '@/js/ITransaction';

export interface IRootState {
    assets: any,
    assetsLoaded: boolean,
    assetAggregatesLoaded: boolean;
    chainId: string,
    recentTransactions: ITransaction[],
    known_addresses: {
        [key:string]: string
    }
}
