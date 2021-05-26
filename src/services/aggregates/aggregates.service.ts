import api from '@/axios'
import { resolveResponseData } from '@/services/helpers'

const AGGREGATES_V2_API_BASE_URL =
    process.env.VUE_APP_AGGREGATES_V2_API_BASE_URL

const ASSET_AGGREGATES_V2_API_BASE_URL =
    process.env.VUE_APP_ASSET_AGGREGATES_V2_API_BASE_URL

/**
 * @param param time interval (1m, 24h, 30d...)
 * @returns time-series of aggregate data
 */
export function getAggregates(param: string) {
    return api
        .get(`${AGGREGATES_V2_API_BASE_URL}/${param}`)
        .then(resolveResponseData)
}

/**
 * @returns list of 24h aggregates
 */
export function getAssetAggregates() {
    return api
        .get(`${ASSET_AGGREGATES_V2_API_BASE_URL}`)
        .then(resolveResponseData)
}
