import { CanonicEventSignature, getEventSignature } from '@/services/abi'
import { EVMBlockLog } from '../models'

async function getEventSig(log: EVMBlockLog) {
    const res = await getEventSignature(log.topics[0])
    console.log('   logID           ', log.topics[0])
    res.results.forEach((result: CanonicEventSignature) => {
        console.log('       could be:   ', result.text_signature)
    })
}

export function parseLogs(logs: EVMBlockLog[] | null) {
    if (!logs) return []
    logs.forEach((log: EVMBlockLog) => {
        getEventSig(log)
    })
    return logs
}
