import api from '@/axios'
import { resolveResponseData } from '@/services/helpers'

const TRANSACTIONS_API_BASE_URL =
    process.env.VUE_APP_TRANSACTIONS_V2_API_BASE_URL

export interface ITransactionPayload {
    mutation: string
    id?: string | null
    params?: ITransactionParams
}

export interface ITransactionParams {
    chainID?: string
    assetID?: string
    address?: string
    disableGenesis?: boolean
    sort?: string
    offset?: number
    limit?: number
    disableCount?: number
}

/**
 *
 * @param params api release
 * @link https://docs.avax.network/build/tools/ortelius#list-transactions
 */
export function getTransaction(
    id?: string | null,
    params?: ITransactionParams
) {
    return api
        .get(
            id
                ? `${TRANSACTIONS_API_BASE_URL}/${id}`
                : TRANSACTIONS_API_BASE_URL,
            { params }
        )
        .then(resolveResponseData)
}
