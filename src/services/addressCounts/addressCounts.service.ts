import api from '@/axios'
import { resolveResponseData } from '@/services/helpers'

const ADDRESS_COUNTS_V2_API_BASE_URL =
    process.env.VUE_APP_ADDRESS_COUNTS_V2_API_BASE_URL

export function getAddressCounts() {
    return api
        .get(`${ADDRESS_COUNTS_V2_API_BASE_URL}`)
        .then(resolveResponseData)
}
