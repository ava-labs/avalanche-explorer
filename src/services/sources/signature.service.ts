import api from '@/price'
import { resolveResponseData } from '@/services/helpers'

const ETHEREUM_SIGNATURE_API_URL = process.env.VUE_APP_4BYTE_URL
const SIGNATURES = process.env.VUE_APP_SIGNATURES_API_URL
const EVENTS = process.env.VUE_APP_EVENT_API_URL

/**
 *
 * @param id first 4 bytes of encoded function
 * @returns list of possible function signatures that match the id
 */
export function getFunctionSignature(id: string) {
    return api
        .get(`${ETHEREUM_SIGNATURE_API_URL}/${SIGNATURES}/?hex_signature=${id}`)
        .then(resolveResponseData)
}

/**
 *
 * @param id bytes of encoded event log
 * @returns list of possible event signatures that match the id
 */
export function getEventSignature(id: string) {
    return api
        .get(`${ETHEREUM_SIGNATURE_API_URL}/${EVENTS}/?hex_signature=${id}`)
        .then(resolveResponseData)
}
