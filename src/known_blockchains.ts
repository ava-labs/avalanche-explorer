interface ChainMap {
    id: string
    name: string
    fullname: string
    code: string
    color: string
    txTypes: TxType[]
}

interface BlockchainDict {
    [key: string]: ChainMap
}

interface TxType {
    id: string
    name: string
}

const DEFAULT_NETWORK_ID = parseInt(
    process.env.VUE_APP_DEFAULT_NETWORKID || '4'
)

export function isMainnetNetwork() {
    return DEFAULT_NETWORK_ID === 1
}

export const P = {
    id: (isMainnetNetwork()
        ? process.env.VUE_APP_PCHAINID
        : process.env.VUE_APP_TEST_PCHAINID) as string,
    name: 'P-Chain',
    fullname: 'Platform',
    code: 'P',
    color: '#3DEE64',
    txTypes: [
        { id: 'add_validator', name: 'Add Validator' },
        { id: 'add_subnet_validator', name: 'Add Subnet Validator' },
        { id: 'add_delegator', name: 'Add Delegator' },
        { id: 'create_subnet', name: 'Create Subnet' },
        { id: 'create_chain', name: 'Create Chain' },
        { id: 'pvm_export', name: 'PVM Export' },
        { id: 'pvm_import', name: 'PVM Import' },
    ],
}

export const X = {
    id: (isMainnetNetwork()
        ? process.env.VUE_APP_XCHAINID
        : process.env.VUE_APP_TEST_XCHAINID) as string,
    name: 'X-Chain',
    fullname: 'Exchange',
    code: 'X',
    color: '#367FFF',
    txTypes: [
        { id: 'base', name: 'Base' },
        { id: 'create_asset', name: 'Create Asset' },
        { id: 'operation', name: 'Operation' },
        { id: 'import', name: 'Import' },
        { id: 'export', name: 'Export' },
    ],
}

export const C = {
    id: (isMainnetNetwork()
        ? process.env.VUE_APP_CCHAINID
        : process.env.VUE_APP_TEST_CCHAINID) as string,
    name: 'C-Chain',
    fullname: 'Contract',
    code: 'C',
    color: '#FFB547',
    txTypes: [
        { id: 'atomic_import_tx', name: 'Atomic Import' },
        { id: 'atomic_export_tx', name: 'Atomic Export' },
    ],
}

const dict: BlockchainDict = {}

dict[P.id] = P
dict[X.id] = X
dict[C.id] = C

export default dict
