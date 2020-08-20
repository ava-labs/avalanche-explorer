import { ChainAddressPayload } from 'avalanche';

interface BlockchainDict {
  [key: string]: string
}

let dict: BlockchainDict = {
  "11111111111111111111111111111111LpoYY": "P-Chain",
  "jnUjZSRt16TcRnZzmh5aMhavwVHz3zBrSN8GfFMTQkzUnoBxC": "X-Chain",
  "saMG5YgNsFxzjz4NMkEkt3bAH6hVxWdZkWcEnGB3Z15pcAmsK": "C-Chain"
};

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
