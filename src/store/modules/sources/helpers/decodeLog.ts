import { EVMBlockLog } from '../../blocks'

export function decodeLog(log: EVMBlockLog, abiDecoder: any) {
    const isDecoded = abiDecoder.decodeLogs([log])
    return [isDecoded] !== undefined ? isDecoded[0] : undefined
}
