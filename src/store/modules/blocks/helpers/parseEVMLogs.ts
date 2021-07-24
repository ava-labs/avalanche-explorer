import { getEventSignature } from '@/services/abi'
import { EVMBlockLog } from '../models'

async function getEventSig(log: EVMBlockLog) {
    const res = await getEventSignature(log.topics[0])
    console.log('event sig res:     ', res)
}

export function parseLogs(logs: EVMBlockLog[] | null) {
    if (!logs) return []
    logs.forEach((log: EVMBlockLog) => {
        getEventSig(log)
    })
    return logs
}
