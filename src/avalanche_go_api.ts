import axios from 'axios'
const AVALANCHE_GO_URL = process.env.VUE_APP_AVALANCHE_GO_URL!;

export default axios.create({
    baseURL: AVALANCHE_GO_URL,
    withCredentials: false,
    headers:{
        'Content-Type' : 'application/json',
    }
})
