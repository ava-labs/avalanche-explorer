// Doesn't really matter what we set, it will change
import axios, { AxiosInstance } from 'axios'

const node_api: AxiosInstance = axios.create({
    baseURL: '/api',
    withCredentials: false,
    headers: {
        'Content-Type': 'application/json',
    },
})

export { node_api }
