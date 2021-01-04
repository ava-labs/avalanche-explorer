import { ITransactionOutputData } from '@/js/ITransaction'
import { OutputType } from './models'

/**
 * Info can be found here @link https://docs.avax.network/build/references/avm-transaction-serialization
 */
const outputTypes = new Map([
    [7, OutputType.TRANSFERABLE],
    [6, OutputType.MINT],
    [10, OutputType.NFT_MINT],
    [11, OutputType.NFT_TRANSFERABLE],
])

export function getOutputType(type: ITransactionOutputData['outputType']) {
    return outputTypes.get(type)
}
