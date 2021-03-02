import {
    DEFAULT_NETWORK_ID,
    peerInfoURL,
    peerInfoURL_test,
} from '@/store/modules/network/network.ts'
import { IVersion } from './models'
import { toAVAX } from '@/helper'
import { getTotalStake } from './peerinfo'

const PEER_INFO_URL = DEFAULT_NETWORK_ID === 1 ? peerInfoURL : peerInfoURL_test

function removePrefix(s: string): string {
    return s.includes('avalanche/') ? s.split('avalanche/')[1] : s
}

/**
 * get a list of peers, ordered by latest version
 */
export async function getPeerInfo() {
    // endpoint returns a string
    const res = (await fetch(PEER_INFO_URL).then((response) =>
        response.text()
    )) as string

    // convert string to structured data
    let peerInfo: IVersion[] = res
        .split('peerinfo')
        .filter((x) => !!x)
        .map((y) => {
            return y
                .slice(1, -1)
                .split(',')
                .reduce((acc, curr) => {
                    return {
                        ...acc,
                        [curr.split('=')[0]]: curr.split('=')[1],
                    }
                }, {})
        })
        .map((z: any) => {
            return {
                version: removePrefix(z.version.slice(1, -1)),
                nodeCount: parseInt(z.nodeCount),
                stakeAmount: toAVAX(z.stakeAmount),
            }
        })
        .sort((a, b) =>
            a.version.localeCompare(b.version, undefined, { numeric: true })
        )
        .reverse()

    const totalStake = getTotalStake(peerInfo)

    peerInfo = peerInfo.map((peer) => {
        return {
            stakePercent: Math.round((peer.stakeAmount / totalStake) * 100),
            ...peer,
        }
    })

    // move 'offline' nodes to end of array
    const offline = peerInfo.shift() as IVersion
    peerInfo.push(offline)

    return peerInfo
}
