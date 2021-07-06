import {
    EVMTransactionResponse,
    EVMBlockQueryResponse,
    EVMBlockLog,
} from '../models'

import ethers from 'ethers'

export function parseEVMTxs(
    tx: EVMTransactionResponse,
    block: EVMBlockQueryResponse
) {
    console.log('tx          ', tx)
    console.log('block       ', block)

    const logs = parseLogs(block, tx)

    // Munge tx and block
    const transaction = {
        ...tx,
        ...block,
        logs,
    }
    console.log('munged tx      ', transaction)
    return transaction
}

export function parseLogs(
    block: EVMBlockQueryResponse,
    transaction: EVMTransactionResponse
) {
    if (!block.logs) return null
    const logs: EVMBlockLog[] = block.logs.filter(
        (l) => l.transactionHash === transaction.hash
    )
    console.log('logs          ', logs)
    logs.forEach((l) => {
        console.log('l.address          ', l.address)
        console.log('l.topic0           ', l.topics[0])
        console.log('l.topic1           ', l.topics[1])
        console.log('l.topic2           ', l.topics[2])
        console.log('l.data             ', l.data)
    })
    return logs
}