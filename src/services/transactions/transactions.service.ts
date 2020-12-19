import api from '@/axios'
import { resolveResponseData } from '@/services/helpers'

const TRANSACTIONS_API_BASE_URL = process.env.VUE_APP_TRANSACTIONS_API_BASE_URL

export interface ITransactionParams {
    assetID?: string
    sort?: string
    offset?: number
    limit?: number
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
