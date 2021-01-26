import avalanche_go_api from '@/avalanche_go_api'
import api from '@/axios'
import { IAddress, IBalance_P_Data } from '@/js/IAddress'
import { resolveResponseData } from '@/services/helpers'
import { IStake_P_Data } from './models'

const ADDRESSES_V2_API_BASE_URL = process.env.VUE_APP_ADDRESSES_V2_API_BASE_URL

export interface IAddressesParams {
    chainID?: string[]

    sort?: string
    offset?: number
    limit?: number
}

// export type Combo = ITransactionParams & IAddressesParams

export function getAddresses(ids: string[]) {
    // PromiseAll ortelius + avalancheGo
    // check for character limit of
    // lean on axios to resolve params for us
}

export function getAddressesFromOrtelius(
    ids: string[],
    params: IAddressesParams
) {
    const joined = ids.toString()
    return api
        .get(`${ADDRESSES_V2_API_BASE_URL}/${joined}`, { params })
        .then(resolveResponseData)
}

export async function getAddressDetails_P(id: string) {
    const req = {
        jsonrpc: '2.0',
        method: 'platform.getBalance',
        params: {
            address: `P-${id}`,
        },
        id: 1,
    }
    const res = await avalanche_go_api.post('', req)
    const result: IBalance_P_Data = res.data.result
    return result
}

export async function getStake_P(id: string) {
    const req = {
        jsonrpc: '2.0',
        method: 'platform.getStake',
        params: {
            address: `P-${id}`,
        },
        id: 1,
    }
    const res = await avalanche_go_api.post('', req)
    const result: IStake_P_Data = res.data.result
    return result
}
