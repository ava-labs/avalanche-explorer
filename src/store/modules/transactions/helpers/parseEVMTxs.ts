import { EVMTransactionResponse } from '../models'
import { EVMBlockQueryResponse, EVMBlockLog } from '@/store/modules/blocks'
import { parseLogs } from '../../blocks/helpers/parseEVMLogs'
import { parseEVMTraces } from './parseEVMTraces'
import { toAVAX } from '@/helper'
import web3 from 'web3'
import { DecodedContractMap } from '../../sources'
//@ts-ignore
import abiDecoder from 'abi-decoder'
import { decodeTxData } from '../../sources/helpers/decodeInput'

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
    verifiedContracts: DecodedContractMap,
    abiDecoder: any
) {
    // Get Logs
    const logs = getLogs(block, tx)
    const logsDecoded: any[] = []

    if (logs.length > 0) {
        // Decode Logs
        logs.map((log: EVMBlockLog) => log)
        // Extract Transfers from Logs
    }

    // Get Traces
    const traces = tx.traces
    const tracesGraph = await parseEVMTraces(
        tx.traces,
        tx.input,
        verifiedContracts
    )

    const transaction = {
        hash: tx.hash,
        createdAt: tx.createdAt, // "2021-05-20T23:30:03.532054Z"

        // SENDER
        fromAddr: tx.fromAddr,
        nonce: tx.nonce,

        // PAYLOAD
        value: toAVAX(parseInt(tx.value), 18),
        input: web3.utils.utf8ToHex(tx.input),
        inputDecoded: decodeTxData(web3.utils.utf8ToHex(tx.input), abiDecoder),
        gasLimit: tx.gasLimit,
        gasPrice: toAVAX(parseInt(tx.gasPrice), 18),

        // RECIPIENT
        toAddr: tx.toAddr,
        toName: verifiedContracts[tx.toAddr]
            ? verifiedContracts[tx.toAddr].name
            : null,

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
        transfers: [],

        // TRACES
        traces,
        tracesGraph,
    }
    // console.log('munged tx      ', transaction)
    return transaction
}
