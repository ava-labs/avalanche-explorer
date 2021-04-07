import api from '@/axios'
import { resolveResponseData } from '@/services/helpers'
import qs from 'qs'

const TRANSACTIONS_API_BASE_URL =
    process.env.VUE_APP_TRANSACTIONS_V2_API_BASE_URL

export interface ITransactionPayload {
    id?: string | null
    params?: ITransactionParams
}

export interface ITransactionParams {
    chainID?: string[]
    assetID?: string
    address?: string
    disableGenesis?: boolean
    sort?: string
    limit?: number
    startTime?: number
    endTime?: number
    offset?: number // to be deprecated
}

/**
    https://explorerapi.avax.network/v2/transactions
        ?assetID=FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z
        &sort=timestamp-desc
        &limit=25
        &chainID=2oYMBNV4eNHyqk2fjjV5nVQLDbtmNJzq5s3qs3Lo6ftnC6FByM
        &chainID=11111111111111111111111111111111LpoYY
 */

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
            {
                params,
                paramsSerializer: (params) =>
                    qs.stringify(params, { arrayFormat: 'repeat' }),
            }
        )
        .then(resolveResponseData)
}
