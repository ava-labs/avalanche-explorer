import axios from 'axios'

const DEFAULT_NETWORK_ID = parseInt(
    process.env.VUE_APP_DEFAULT_NETWORKID || '4'
)

const avalancheGoURL =
    DEFAULT_NETWORK_ID === 1
        ? (process.env.VUE_APP_AVALANCHE_GO_URL as string)
        : (process.env.VUE_APP_TEST_AVALANCHE_GO_URL as string)

export default axios.create({
    baseURL: avalancheGoURL,
    withCredentials: false,
    headers: {
        'Content-Type': 'application/json',
    },
})
