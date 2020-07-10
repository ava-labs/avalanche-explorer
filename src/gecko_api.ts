import axios from 'axios'

const api_url = `https://testapi.avax.network:443/ext/P`;

export default axios.create({
    baseURL: api_url,
    withCredentials: false,
    headers:{
        'Content-Type' : 'application/json',
    }
})
