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
    const peerMap: any = {}
    res.split('peerinfo_')
        .filter((x) => !!x)
        .map((y) => y.split('{version="'))
        .forEach((peer) => {
            const datum = removePrefix(peer[1])
                .replace(/(\r\n|\n|\r)/gm, '')
                .split(`"} `)
            if (peer[0] === 'nodecount') {
                peerMap[datum[0]] = {
                    version: datum[0],
                    nodeCount: parseInt(datum[1]),
                }
            } else {
                peerMap[datum[0]].stakeAmount = toAVAX(datum[1])
            }
        })

    // create list for charts
    let peerInfo: IVersion[] = []
    for (const peer in peerMap) {
        peerInfo.push(peerMap[peer])
    }

    const totalStake = getTotalStake(peerInfo)

    peerInfo = peerInfo
        .sort((a, b) =>
            a.version.localeCompare(b.version, undefined, { numeric: true })
        )
        .reverse()
        .map((peer) => {
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
