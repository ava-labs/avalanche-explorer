import { EVMTransactionResponse } from '../models'
import { EVMBlockQueryResponse, EVMBlockLog } from '@/store/modules/blocks'
import { parseLogs } from '../../blocks/helpers/parseEVMLogs'
import { getError, parseEVMTraces } from './parseEVMTraces'
import { toAVAX } from '@/helper'
import { DecodedContractMap, DecodedFunction } from '../../sources'
//@ts-ignore
import { decodeFunction } from '../../sources/helpers/decodeFunction'
import Big from 'big.js'

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
    block: EVMBlockQueryResponse,
    verifiedContracts?: DecodedContractMap,
    abiDecoder?: any
) {
    let logs: any[] | null = null
    let logsDecoded: any[] | null = null
    let transfers: any[] | null = null
    let tracesGraph: any[] | null = null
    let toName: string | null = null
    let input: string | null = null
    let inputDecoded: DecodedFunction | null = null
    let inputError: string | null = null

    if (tx.input && verifiedContracts) {
        // Decode toAddr
        toName = verifiedContracts[tx.toAddr]
            ? verifiedContracts[tx.toAddr].name
            : null

        // Decode Input
        input = `0x${Buffer.from(tx.input, 'base64').toString('hex')}`

        inputDecoded = tx.traces[0].input
            ? decodeFunction(tx.traces[0].input, abiDecoder)
            : null

        inputError = getError(tx.traces[0])

        // Extract Logs From Block
        logs = getLogs(block, tx)
        if (logs.length > 0) {
            // Decode Logs
            logsDecoded = logs.map((log: EVMBlockLog) => log)
            // Extract Transfers from Logs
            transfers = null
        }

        // Get Traces
        tracesGraph = verifiedContracts
            ? await parseEVMTraces(
                  [...tx.traces], // clone this bc we will manipulate the array
                  tx.input!,
                  verifiedContracts
              )
            : null

        // console.log('tx.traces:     ', tx.traces)
        // console.log('tracesGraph:   ', tracesGraph)
    }

    const transaction = {
        hash: tx.hash,
        createdAt: tx.createdAt, // "2021-05-20T23:30:03.532054Z"
        type: tx.input ? 'Call' : 'Value',

        // SENDER
        fromAddr: tx.fromAddr,
        nonce: tx.nonce,

        // PAYLOAD
        value: new Big(tx.value).div(Math.pow(10, 18)),
        input,
        inputDecoded,
        inputError,
        gasLimit: tx.gasLimit,
        gasPrice: new Big(tx.gasPrice),

        // RECIPIENT
        toAddr: tx.toAddr,
        toName,

        // BLOCK
        ...block,
        block: tx.block,
        blockGasLimit: tx.blockGasLimit,
        blockGasUsed: tx.blockGasUsed,
        blockHash: tx.blockHash,
        blockNonce: tx.blockNonce,

        // LOGS
        logs,
        logsDecoded,
        transfers,

        // TRACES
        traces: tx.traces,
        tracesGraph,
    }
    // console.log('munged tx      ', transaction)
    return transaction
}
