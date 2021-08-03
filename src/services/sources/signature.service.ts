import api from '@/price'
import { resolveResponseData } from '@/services/helpers'

const ETHEREUM_SIGNATURE_API_URL = process.env.VUE_APP_4BYTE_URL
const SIGNATURES = process.env.VUE_APP_SIGNATURES_API_URL
const EVENTS = process.env.VUE_APP_EVENT_API_URL

/**
 *
 * @param id
 * @returns list of 4-byte signatures that match the method id
 */
export function getSignature(id: string) {
    return api
        .get(`${ETHEREUM_SIGNATURE_API_URL}/${SIGNATURES}/?hex_signature=${id}`)
        .then(resolveResponseData)
}

/**
 *
 * @param id
 * @returns list of 4-byte signatures that match the event id
 */
export function getEventSignature(id: string) {
    return api
        .get(`${ETHEREUM_SIGNATURE_API_URL}/${EVENTS}/?hex_signature=${id}`)
        .then(resolveResponseData)
}
