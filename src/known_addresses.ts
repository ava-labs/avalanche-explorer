const DEFAULT_NETWORK_ID = parseInt(
    process.env.VUE_APP_DEFAULT_NETWORKID || '4'
)

const AVAX_FAUCET_ID =
    DEFAULT_NETWORK_ID === 1
        ? (process.env.VUE_APP_FAUCETADDRESS as string)
        : (process.env.VUE_APP_TEST_FAUCETADDRESS as string)

interface AddressDict {
    [key: string]: string
}

const dict: AddressDict = {}

dict[AVAX_FAUCET_ID] = 'The AVAX Faucet'

export default dict
