const DEFAULT_NETWORK_ID = parseInt(
    process.env.VUE_APP_DEFAULT_NETWORKID || '4'
)

export const PCHAINID =
    DEFAULT_NETWORK_ID === 1
        ? (process.env.VUE_APP_PCHAINID as string)
        : (process.env.VUE_APP_TEST_PCHAINID as string)

export const XCHAINID =
    DEFAULT_NETWORK_ID === 1
        ? (process.env.VUE_APP_XCHAINID as string)
        : (process.env.VUE_APP_TEST_XCHAINID as string)

export const CCHAINID =
    DEFAULT_NETWORK_ID === 1
        ? (process.env.VUE_APP_CCHAINID as string)
        : (process.env.VUE_APP_TEST_CCHAINID as string)

interface BlockchainDict {
    [key: string]: string
}

const dict: BlockchainDict = {}

dict[PCHAINID] = 'P-Chain'
dict[XCHAINID] = 'X-Chain'
dict[CCHAINID] = 'C-Chain'

export default dict
