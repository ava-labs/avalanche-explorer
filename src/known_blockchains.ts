import { faCommentsDollar } from '@fortawesome/free-solid-svg-icons';

const defaultNetworkID = parseInt(process.env.VUE_APP_DEFAULT_NETWORKID || "4");

const xChainID = (defaultNetworkID === 0) 
  ? process.env.VUE_APP_XCHAINID as string
  : process.env.VUE_APP_TEST_XCHAINID as string;

const cChainID = (defaultNetworkID === 0) 
  ? process.env.VUE_APP_CCHAINID as string
  : process.env.VUE_APP_TEST_CCHAINID as string;

interface BlockchainDict {
  [key: string]: string
}

let dict: BlockchainDict = {
  "11111111111111111111111111111111LpoYY": "P-Chain",
};

dict[xChainID] = "X-Chain";
dict[cChainID] = "C-Chain";

interface URLMap {
  [key: string]: ClientMap
}

interface ClientMap {
  [key: string]: string
}

let prefixDict: URLMap = {
  "x-chain": {
    "go": "/ext/bc/X/",
    "js": "/ext/bc/X/",
    "ortelius": "/x/",
    "prefix": "X-",
  },
  "p-chain": {
    "go": "/ext/P/",
    "js": "/ext/P/",
    "ortelius": "/p/",
    "prefix": "P-"
  }
}
export default dict;
