const DEFAULT_NETWORK_ID = parseInt(
    process.env.VUE_APP_DEFAULT_NETWORKID || '4'
)

const XCHAINID =
    DEFAULT_NETWORK_ID === 1
        ? (process.env.VUE_APP_XCHAINID as string)
        : (process.env.VUE_APP_TEST_XCHAINID as string)

const CCHAINID =
    DEFAULT_NETWORK_ID === 1
        ? (process.env.VUE_APP_CCHAINID as string)
        : (process.env.VUE_APP_TEST_CCHAINID as string)

interface BlockchainDict {
    [key: string]: string
}

let dict: BlockchainDict = {
    '11111111111111111111111111111111LpoYY': 'P-Chain',
}

dict[XCHAINID] = 'X-Chain'
dict[CCHAINID] = 'C-Chain'

interface URLMap {
    [key: string]: ClientMap
}

interface ClientMap {
    [key: string]: string
}

let prefixDict: URLMap = {
    'x-chain': {
        go: '/ext/bc/X/',
        js: '/ext/bc/X/',
        ortelius: '/x/',
        prefix: 'X-',
    },
    'p-chain': {
        go: '/ext/P/',
        js: '/ext/P/',
        ortelius: '/p/',
        prefix: 'P-',
    },
}
export default dict
