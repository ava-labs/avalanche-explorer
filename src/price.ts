import axios from 'axios'

const COINGECKO_URL = process.env.VUE_APP_COINGECKO_URL

export default axios.create({
    baseURL: COINGECKO_URL,
    withCredentials: false,
    headers: {
        'Content-Type': 'application/json',
    },
})
