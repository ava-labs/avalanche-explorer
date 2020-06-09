import axios from 'axios'
const api_url = process.env.VUE_APP_API_URL;

export default axios.create({
    baseURL: api_url,
    withCredentials: false,
    headers:{
        'Content-Type' : 'application/json',
    }
})
