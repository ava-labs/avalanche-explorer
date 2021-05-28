import { OutputResponse } from '@/store/modules/transactions/models'
import { OutputType, BlockType } from './models'

export interface TxType {
    long: string
    short: string
}

/**
 * These types come from here @link https://github.com/ava-labs/ortelius/blob/ec567c97630383d1a4ef468cf1bcf35d5d1eb3d2/services/indexes/models/types.go#L56
 */
export const txTypeMap = new Map<string, TxType>([
    [
        'base',
        {
            long: 'Base',
            short: '',
        },
    ],
    [
        'create_asset',
        {
            long: 'Create Asset',
            short: 'Mint',
        },
    ],
    /**
     * @link https://docs.avax.network/build/references/avm-transaction-serialization#operations
     */
    [
        'operation',
        {
            long: 'Operation',
            short: 'NFT',
        },
    ],
    [
        'import',
        {
            long: 'Import',
            short: 'Import',
        },
    ],
    [
        'export',
        {
            long: 'Export',
            short: 'Export',
        },
    ],
    [
        'atomic_import_tx',
        {
            long: 'Atomic Import',
            short: 'Import',
        },
    ],
    [
        'atomic_export_tx',
        {
            long: 'Atomic Export',
            short: 'Export',
        },
    ],
    [
        'add_validator',
        {
            long: 'Add Validator',
            short: 'Validate',
        },
    ],
    [
        'add_subnet_validator',
        {
            long: 'Add Subnet Validator',
            short: 'Validate Subnet',
        },
    ],
    [
        'add_delegator',
        {
            long: 'Add Delegator',
            short: 'Delegate',
        },
    ],
    [
        'create_subnet',
        {
            long: 'Create Subnet',
            short: 'Create Subnet',
        },
    ],
    [
        'create_chain',
        {
            long: 'Create Chain',
            short: 'Create Chain',
        },
    ],
    [
        'pvm_export',
        {
            long: 'PVM Export',
            short: 'Export',
        },
    ],
    [
        'pvm_import',
        {
            long: 'PVM Import',
            short: 'Import',
        },
    ],
    [
        'advance_time',
        {
            long: 'Advance Time',
            short: 'Advance Time',
        },
    ],
    [
        'reward_validator',
        {
            long: 'Reward Validator',
            short: 'Reward',
        },
    ],
])

export function getMappingForType(type: string) {
    return txTypeMap.get(type)!.short || ''
}

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

export const NFTTypes = new Map([
    [1, 'UTF-8'],
    [24, 'JSON'],
    [27, 'URL'],
])

export function getNFTType(type: number) {
    return NFTTypes.get(type)
}
