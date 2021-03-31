import { txTypeMap, TxType } from '@/store/modules/transactions/maps'
interface ChainMap {
    id: string
    name: string
    fullname: string
    code: string
    color: string
    txTypes: [string, TxType][]
}

interface BlockchainDict {
    [key: string]: ChainMap
}

const DEFAULT_NETWORK_ID = parseInt(
    process.env.VUE_APP_DEFAULT_NETWORKID || '4'
)

export function isMainnetNetwork() {
    return DEFAULT_NETWORK_ID === 1
}

export const P: ChainMap = {
    id: (isMainnetNetwork()
        ? process.env.VUE_APP_PCHAINID
        : process.env.VUE_APP_TEST_PCHAINID) as string,
    name: 'P-Chain',
    fullname: 'Platform',
    code: 'P',
    color: '#3DEE64',
    txTypes: [
        ['add_validator', txTypeMap.get('add_validator')!],
        ['add_subnet_validator', txTypeMap.get('add_subnet_validator')!],
        ['add_delegator', txTypeMap.get('add_delegator')!],
        ['create_subnet', txTypeMap.get('create_subnet')!],
        ['create_chain', txTypeMap.get('create_chain')!],
        ['pvm_export', txTypeMap.get('pvm_export')!],
        ['pvm_import', txTypeMap.get('pvm_import')!],
    ],
}

/*
txTypes: [
    { id: 'add_validator', name: 'Add Validator' },
    { id: 'add_subnet_validator', name: 'Add Subnet Validator' },
    { id: 'add_delegator', name: 'Add Delegator' },
    { id: 'create_subnet', name: 'Create Subnet' },
    { id: 'create_chain', name: 'Create Chain' },
    { id: 'pvm_export', name: 'PVM Export' },
    { id: 'pvm_import', name: 'PVM Import' },
],
 */

export const X: ChainMap = {
    id: (isMainnetNetwork()
        ? process.env.VUE_APP_XCHAINID
        : process.env.VUE_APP_TEST_XCHAINID) as string,
    name: 'X-Chain',
    fullname: 'Exchange',
    code: 'X',
    color: '#367FFF',
    txTypes: [
        ['base', txTypeMap.get('base')!],
        ['create_asset', txTypeMap.get('create_asset')!],
        ['operation', txTypeMap.get('operation')!],
        ['import', txTypeMap.get('import')!],
        ['export', txTypeMap.get('export')!],
    ],
}

export const C: ChainMap = {
    id: (isMainnetNetwork()
        ? process.env.VUE_APP_CCHAINID
        : process.env.VUE_APP_TEST_CCHAINID) as string,
    name: 'C-Chain',
    fullname: 'Contract',
    code: 'C',
    color: '#FFB547',
    txTypes: [
        ['atomic_import_tx', txTypeMap.get('atomic_import_tx')!],
        ['atomic_export_tx', txTypeMap.get('atomic_export_tx')!],
    ],
}

/*
 txTypes: [
        { id: 'atomic_import_tx', name: 'Atomic Import' },
        { id: 'atomic_export_tx', name: 'Atomic Export' },
    ],
*/

const dict: BlockchainDict = {}

dict[P.id] = P
dict[X.id] = X
dict[C.id] = C

export default dict

export const txChainTypeMap = new Map<string, typeof C>([
    [C.id, C],
    [P.id, P],
    [X.id, X],
])

export function getTxChainType(type: string) {
    return txChainTypeMap.get(type)
}
