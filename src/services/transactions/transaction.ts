import { ITransactionOutputData } from '@/js/ITransaction'
import { OutputType, BlockType } from './models'

/**
 * Info can be found here @link https://docs.avax.network/build/references/avm-transaction-serialization
 */
const outputTypes = new Map([
    [7, OutputType.TRANSFERABLE],
    [6, OutputType.MINT],
    [10, OutputType.NFT_MINT],
    [11, OutputType.NFT_TRANSFERABLE],
    [4294967281, OutputType.ATOMIC_EXPORT_TX],
    [4294967282, OutputType.ATOMIC_EXPORT_TX],
])

export function getOutputType(type: ITransactionOutputData['outputType']) {
    return outputTypes.get(type)
}

const blockTypes = new Map([
    [0, BlockType.PROPOSAL],
    [1, BlockType.ABORT],
    [2, BlockType.COMMIT],
    [3, BlockType.STANDARD],
    [4, BlockType.ATOMIC],
])

export function getBlockType(type: number) {
    return blockTypes.get(type)
}
