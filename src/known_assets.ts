const DEFAULT_NETWORK_ID = parseInt(
    process.env.VUE_APP_DEFAULT_NETWORKID || '4'
)

export const AVAX_ID =
    DEFAULT_NETWORK_ID === 1
        ? (process.env.VUE_APP_AVAXID as string)
        : (process.env.VUE_APP_TEST_AVAXID as string)

interface AssetDict {
    [key: string]: string
}

const dict: AssetDict = {
    AVAX: AVAX_ID,
}

export default dict
