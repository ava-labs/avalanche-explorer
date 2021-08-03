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
    // Get Logs
    const logs = getLogs(block, tx)
    const parsedLogs: any[] = []

    if (logs.length > 0) {
        // Decode Logs
        logs.map((log: EVMBlockLog) => log)
        // Extract Transfers from Logs
    }

    // Get Traces
    const traces = tx.traces
    const tracesGraph = await parseEVMTraces(tx.traces, tx.input)

    if (traces.length > 0) {
        // Decode Traces
    }

    const parsedTraces: any[] = []
    const parsedTracesGraph: any[] = []

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
        // SEMANTIC LIFTING
        parsedLogs,
        parsedTraces,
        parsedTracesGraph,
        transfers: [],
    }
    // console.log('munged tx      ', transaction)
    return transaction
}
