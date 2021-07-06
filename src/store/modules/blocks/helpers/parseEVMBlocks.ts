import { EVMBlockQueryResponse, EVMBlockLog } from '../models'

// import ethers from 'ethers'

export function parseLogs(block: EVMBlockQueryResponse) {
    if (!block.logs) return null
    const logs: EVMBlockLog[] = block.logs
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
    const logs = parseLogs(block)
    return block
}
