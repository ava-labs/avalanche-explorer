import { OutputResponse } from '@/store/modules/transactions/models'
import { OutputType, BlockType } from './models'
import { CChainInfo, PChainInfo, XChainInfo } from '@/helper'

/**
 * These types come from here @link https://github.com/ava-labs/ortelius/blob/ec567c97630383d1a4ef468cf1bcf35d5d1eb3d2/services/indexes/models/types.go#L56
 */
export const txTypeMap = new Map<string, string>([
    ['base', ''],
    ['create_asset', 'Create Asset'], // X
    /**
     * @link https://docs.avax.network/build/references/avm-transaction-serialization#operations
     */
    ['operation', 'NFT'], // X
    ['import', 'Import'], // X
    ['export', 'Export'], // X
    ['atomic_import_tx', 'Import'], // C
    ['atomic_export_tx', 'Export'], // C
    ['add_validator', 'Add Validator'], // P
    ['add_subnet_validator', 'Add Subnet Validator'], // P
    ['add_delegator', 'Add Delegator'], // P
    ['create_subnet', 'Create Subnet'], // P
    ['create_chain', 'Create Chain'], // P
    ['pvm_export', 'Export'], // P
    ['pvm_import', 'Import'], // P
    ['advance_time', 'Advance Time'], // P
    ['reward_validator', 'Reward Validator'], // P
])

/**
 * Info can be found here @link https://docs.avax.network/build/references/avm-transaction-serialization
 */
const outputTypes = new Map([
    [6, OutputType.MINT],
    [7, OutputType.TRANSFERABLE],
    [10, OutputType.NFT_MINT],
    [11, OutputType.NFT_TRANSFERABLE],
    [4294967281, OutputType.ATOMIC_EXPORT_TX],
    [4294967282, OutputType.ATOMIC_EXPORT_TX],
])

export function getOutputType(type: OutputResponse['outputType']) {
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

export const txChainTypeMap = new Map<string, typeof CChainInfo>([
    [CChainInfo.id, CChainInfo],
    [PChainInfo.id, PChainInfo],
    [XChainInfo.id, XChainInfo],
])

export function getTxChainType(type: string) {
    return txChainTypeMap.get(type)
}

export const NFTTypes = new Map([
    [1, 'UTF-8'],
    [24, 'JSON'],
    [27, 'URL'],
])

export function getNFTType(type: number) {
    return NFTTypes.get(type)
}
