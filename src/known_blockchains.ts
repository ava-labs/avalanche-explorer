const xChainID = process.env.VUE_APP_XCHAINID;
const cChainID = process.env.VUE_APP_CCHAINID;

interface BlockchainDict {
  [key: string]: string
}

let dict: BlockchainDict = {
  "11111111111111111111111111111111LpoYY": "P-Chain",
  xChainID: "X-Chain",
  cChainID: "C-Chain"
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
``