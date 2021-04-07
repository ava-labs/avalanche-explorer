import api from '@/axios'
import { resolveResponseData } from '@/services/helpers'

const ASSETS_V2_API_BASE_URL = process.env.VUE_APP_ASSETS_V2_API_BASE_URL

const CACHE_ASSETS_V2_API_BASE_URL =
    process.env.VUE_APP_CACHE_ASSETS_V2_API_BASE_URL

export function getAssetInfo(id: string) {
    return api.get(`${ASSETS_V2_API_BASE_URL}/${id}`).then(resolveResponseData)
}

export function getCacheAssets() {
    return api.get(`${CACHE_ASSETS_V2_API_BASE_URL}`).then(resolveResponseData)
}
