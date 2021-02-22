import { ITransactionDataResponse } from '@/services/transactions/models.ts'
import { Asset } from '@/js/Asset'
import { ICollisionMap } from '@/js/IAsset'

export interface IRootState {
    assets: {
        [key: string]: Asset
    }
    assetsLoaded: boolean
    assetAggregatesLoaded: boolean
    chainId: string
    txRes: ITransactionDataResponse
    recentTxRes: ITransactionDataResponse
    assetTxRes: ITransactionDataResponse
    addressTxRes: ITransactionDataResponse
    known_addresses: {
        [key: string]: string
    }
    assetsSubsetForAggregations: {
        [key: string]: boolean
    }
    collisionMap: ICollisionMap
}
