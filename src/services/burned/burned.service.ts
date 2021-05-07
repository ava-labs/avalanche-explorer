import {
    DEFAULT_NETWORK_ID,
    ethereumAPI,
    ethereumAPI_test,
} from '@/store/modules/network/network.ts'

const BURNED_URL = DEFAULT_NETWORK_ID === 1 ? ethereumAPI : ethereumAPI_test

/**
 * get burned AVAX for the C-chain
 */
export async function getBurnedC() {
    return await fetch(BURNED_URL, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_getBalance',
            params: ['0x0100000000000000000000000000000000000000', 'latest'],
            id: 1,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            return parseInt(data.result) / Math.pow(10, 18)
        })
}
