import { EVMTransactionResponse } from '../models'
import { EVMBlockQueryResponse, EVMBlockLog } from '@/store/modules/blocks'
import { parseLogs } from '../../blocks/helpers/parseEVMLogs'
import { parseEVMTraces } from './parseEVMTraces'
import { toAVAX } from '@/helper'
import web3 from 'web3'

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

export async function parseEVMTxs(
    tx: EVMTransactionResponse,
    block: EVMBlockQueryResponse
) {
    // Decode Logs
    const logs = getLogs(block, tx)
    console.log('logs       ', logs)

    // Decode Transfers

    // Decode Traces
    const traces = tx.traces
    const tracesGraph = await parseEVMTraces(tx.traces, tx.input)

    // Munge tx and block
    const transaction = {
        ...tx,
        // PAYLOAD
        gasPrice: toAVAX(parseInt(tx.gasPrice), 18),
        input: web3.utils.utf8ToHex(tx.input),
        ...block,
        logs,
        traces,
        tracesGraph,
        transfers: [],
    }
    // console.log('munged tx      ', transaction)
    return transaction
}
