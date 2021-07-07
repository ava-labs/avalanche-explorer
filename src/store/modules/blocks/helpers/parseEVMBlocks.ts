import {
    EVMBlockQueryResponse,
    EVMBlockLog,
    EVMBlockTransaction,
} from '../models'
import web3 from 'web3'

export function parseEVMBlockTxs(txs: EVMBlockTransaction[]) {
    console.log('txs          ', txs)
    if (!txs) return null
    const parsedTxs = txs.map((tx) => {
        return {
            hash: tx.hash,
            type: tx.type,
            // SENDER (v,r,s resolves to fromAddr)
            v: '',
            r: '',
            s: '',
            nonce: '',

            // PAYLOAD
            value: '',
            input: '',
            gasPrice: parseInt(web3.utils.hexToNumberString(tx.gasPrice)),
            gas: parseInt(web3.utils.hexToNumberString(tx.gas)),

            // RECIPIENT
            to: tx.to,
        }
    })
    console.log('parsedTxs              ', parsedTxs)
    return parsedTxs
}

export function parseLogs(logs: EVMBlockLog[]) {
    if (!logs) return null
    logs.forEach((l) => {
        console.log('l.address          ', l.address)
        console.log('l.topic0           ', l.topics[0])
        console.log('l.topic1           ', l.topics[1])
        console.log('l.topic2           ', l.topics[2])
        console.log('l.data             ', l.data)
    })
    return logs
}

export function parseEVMBlocks(block: EVMBlockQueryResponse) {
    console.log('block       ', block)
    const parsedBlock = {
        number: parseInt(web3.utils.hexToNumberString(block.header.number)),
        timestamp:
            parseInt(web3.utils.hexToNumberString(block.header.timestamp)) *
            1000,

        // MODIFIED MERKLE PATRICIA TREE
        hash: block.header.hash,
        parentHash: block.header.parentHash,
        stateRoot: block.header.stateRoot,
        transactionsRoot: block.header.stateRoot,
        receiptsRoot: block.header.receiptsRoot,

        // BLOCK SIZE
        gasLimit: parseInt(web3.utils.hexToNumberString(block.header.gasLimit)),
        gasUsed: parseInt(web3.utils.hexToNumberString(block.header.gasUsed)),
        miner: block.header.miner,

        transactions: block.transactions
            ? parseEVMBlockTxs(block.transactions)
            : null,
        logs: block.logs ? parseLogs(block.logs) : null,
        extraData: block.blockExtraData,
        blockExtraDataFromHeader: String.fromCharCode(
            ...web3.utils.hexToBytes(block.header.extraData)
        ),
    }
    console.log('parsedBlock       ', parsedBlock)
    return parsedBlock
}
