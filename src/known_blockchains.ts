import { ChainAddressPayload } from 'avalanche';

interface BlockchainDict {
  [key: string]: string
}

let dict: BlockchainDict = {
  "11111111111111111111111111111111LpoYY": "P-Chain",
  // "rrEWX7gc7D9mwcdrdBxBTdqh1a7WDVsMuadhTZgyXfFcRz45L": "X-Chain",
  "2VvmkRw4yrz8tPrVnCCbvEK1JxNyujpqhmU6SGonxMpkWBx9UD": "X-Chain",
  "zJytnh96Pc8rM337bBrtMvJDbEdDNjcXG3WkTNCiLp18ergm9": "C-Chain"
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
