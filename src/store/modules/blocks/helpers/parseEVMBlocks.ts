import {
    EVMBlockQueryResponse,
    EVMBlockLog,
    EVMBlockTransaction,
} from '../models'
import web3 from 'web3'

export function parseEVMBlockTxs(txs: EVMBlockTransaction[] | null) {
    console.log('txs                ', txs)
    if (!txs) return []
    const parsedTxs = txs.map((tx) => {
        console.log('tx.input           ', web3.utils.hexToAscii(tx.input))

        return {
            hash: tx.hash,
            type: tx.type,
            // SENDER (v,r,s resolves to fromAddr)
            v: '',
            r: '',
            s: '',
            nonce: '',

            // PAYLOAD
            value: parseInt(web3.utils.hexToNumberString(tx.value)),
            input: web3.utils.hexToAscii(tx.input), //TODO https://ethereum.stackexchange.com/questions/11144/how-to-decode-input-data-from-a-transaction
            gasPrice: parseInt(web3.utils.hexToNumberString(tx.gasPrice)),
            gas: parseInt(web3.utils.hexToNumberString(tx.gas)),

            // RECIPIENT
            to: tx.to,
        }
    })

    console.log('parsedTxs          ', parsedTxs)
    return parsedTxs
}

export function parseLogs(logs: EVMBlockLog[] | null) {
    if (!logs) return []
    logs.forEach((l) => {
        console.log('-------------------')
        console.log('l.address          ', l.address)
        console.log('l.topic0           ', l.topics[0])
        console.log('l.topic1           ', l.topics[1])
        console.log('l.topic2           ', l.topics[2])
        console.log('l.data             ', l.data)
    })
    return logs
}

function _base64ToArrayBuffer(base64: string) {
    const binary_string = window.atob(base64)
    const len = binary_string.length
    const bytes = new Uint8Array(len)
    for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i)
    }
    return bytes.buffer
}

export function parseEVMBlocks(block: EVMBlockQueryResponse) {
    console.log('block              ', block)
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
        validator: block.header.miner,

        transactions: parseEVMBlockTxs(block.transactions),
        logs: parseLogs(block.logs),
        extraData: block.blockExtraData, // _base64ToArrayBuffer(block.blockExtraData),
        extraDataHash: block.header.extDataHash,
    }
    console.log('parsedBlock        ', parsedBlock)
    return parsedBlock
}
