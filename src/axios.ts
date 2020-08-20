import axios from 'axios'
const api_url = process.env.VUE_APP_ORTELIUS_URL;

export default axios.create({
    baseURL: api_url,
    withCredentials: false,
    headers:{
        'Content-Type' : 'application/json',
    }
})
