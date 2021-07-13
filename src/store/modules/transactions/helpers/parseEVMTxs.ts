import { EVMTransactionResponse } from '../models'
import { EVMBlockQueryResponse, EVMBlockLog } from '@/store/modules/blocks'
import { parseLogs } from '../../blocks/helpers/parseEVMLogs'

export function getLogs(
    block: EVMBlockQueryResponse,
    transaction: EVMTransactionResponse
) {
    if (!block.logs) return []
    let logs: EVMBlockLog[] = block.logs.filter(
        (l) => l.transactionHash === transaction.hash
    )
    logs = parseLogs(logs)
    return logs
}

export function parseEVMTxs(
    tx: EVMTransactionResponse,
    block: EVMBlockQueryResponse
) {
    console.log('tx          ', tx)
    console.log('block       ', block)

    const logs = getLogs(block, tx)

    // Munge tx and block
    const transaction = {
        ...tx,
        ...block,
        logs,
        transfers: [],
    }
    console.log('munged tx      ', transaction)
    return transaction
}
