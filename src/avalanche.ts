import * as avalancheJS from 'avalanche'

const DEFAULT_NETWORK_ID = parseInt(
    process.env.VUE_APP_DEFAULT_NETWORKID || '4'
)

let PROTOCOL = ''
let IP = ''
let PORT = 80
let NETWORK_ID = 0
let CHAIN_ID = 'X'

if (DEFAULT_NETWORK_ID === 1) {
    PROTOCOL = process.env.VUE_APP_AVALANCHE_JS_PROTOCOL as string
    IP = process.env.VUE_APP_AVALANCHE_JS_IP as string
    PORT = parseInt(process.env.VUE_APP_AVALANCHE_JS_PORT as string)
    NETWORK_ID = parseInt(process.env.VUE_APP_AVALANCHE_JS_NETWORKID as string)
    CHAIN_ID = process.env.VUE_APP_AVALANCHE_JS_CHAINID as string
} else {
    PROTOCOL = process.env.VUE_APP_TEST_AVALANCHE_JS_PROTOCOL as string
    IP = process.env.VUE_APP_TEST_AVALANCHE_JS_IP as string
    PORT = parseInt(process.env.VUE_APP_TEST_AVALANCHE_JS_PORT as string)
    NETWORK_ID = parseInt(
        process.env.VUE_APP_TEST_AVALANCHE_JS_NETWORKID as string
    )
    CHAIN_ID = process.env.VUE_APP_TEST_AVALANCHE_JS_CHAINID as string
}

const avalanche = new avalancheJS.Avalanche(
    IP,
    PORT,
    PROTOCOL,
    NETWORK_ID,
    CHAIN_ID
)
const avm = avalanche.XChain()
const platform = avalanche.PChain()

export { avalanche, avm, platform }
