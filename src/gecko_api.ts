import axios from 'axios'

const api_url = `https://explorerapi.ava.network:21000/ext/P`;

export default axios.create({
    baseURL: api_url,
    withCredentials: false,
    headers:{
        'Content-Type' : 'application/json',
    }
})
