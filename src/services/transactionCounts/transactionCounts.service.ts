import api from '@/axios'
import { resolveResponseData } from '@/services/helpers'

const TRANSACTION_COUNTS_API_BASE_URL =
    process.env.VUE_APP_TRANSACTION_COUNTS_API_BASE_URL

export function getTxCounts() {
    return api
        .get(`${TRANSACTION_COUNTS_API_BASE_URL}`)
        .then(resolveResponseData)
}
