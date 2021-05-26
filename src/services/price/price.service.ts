import api from '@/price'
import { resolveResponseData } from '@/services/helpers'
import qs from 'qs'

const PRICE_API_URL = process.env.VUE_APP_PRICE_API_URL

export interface PriceParams {
    ids: string[]
    vs_currencies: string[]
    category?: string
    order?: string
    per_page?: number
    page?: number
    sparkline?: boolean
    price_change_percentage?: string
}

export function getPrices(params?: PriceParams) {
    return api
        .get(`${PRICE_API_URL}`, {
            params,
            paramsSerializer: (params) =>
                qs.stringify(params, { arrayFormat: 'comma', encode: false }),
        })
        .then(resolveResponseData)
}
