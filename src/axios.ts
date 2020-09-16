import axios from 'axios'

const defaultNetworkID = parseInt(process.env.VUE_APP_DEFAULT_NETWORKID || "4");

const api_url = (defaultNetworkID === 0) 
  ? process.env.VUE_APP_ORTELIUS_URL as string
  : process.env.VUE_APP_TEST_ORTELIUS_URL as string;

export default axios.create({
    baseURL: api_url,
    withCredentials: false,
    headers:{
        'Content-Type' : 'application/json',
    }
});
