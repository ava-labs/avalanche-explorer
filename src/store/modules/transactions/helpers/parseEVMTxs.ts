import {
    EVMTransactionResponse,
    EVMBlockQueryResponse,
    EVMBlockLog,
} from '../models'

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
    }
    console.log(transaction)
}

export function parseLogs(
    block: EVMBlockQueryResponse,
    transaction: EVMTransactionResponse
) {
    const logs: EVMBlockLog[] = block.logs.filter(
        (l) => l.transactionHash === transaction.hash
    )
    console.log('logs          ', logs)
    return logs
}
