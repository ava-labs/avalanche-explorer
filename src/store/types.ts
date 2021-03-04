import {
    TransactionQueryResponse,
    TransactionsState,
} from '@/store/modules/transactions/models'
import { Asset } from '@/js/Asset'
import { ICollisionMap } from '@/js/IAsset'

export interface IRootState {
    assets: {
        [key: string]: Asset
    }
    assetsLoaded: boolean
    assetAggregatesLoaded: boolean
    chainId: string
    recentTxRes: TransactionQueryResponse
    known_addresses: {
        [key: string]: string
    }
    assetsSubsetForAggregations: {
        [key: string]: boolean
    }
    collisionMap: ICollisionMap
    Transactions: TransactionsState
}
