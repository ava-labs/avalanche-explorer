const defaultNetworkID = parseInt(process.env.VUE_APP_DEFAULT_NETWORKID || "4");

const avaxID = (defaultNetworkID === 0) 
  ? process.env.VUE_APP_AVAXID as string
  : process.env.VUE_APP_TEST_AVAXID as string;

interface AssetDict {
  [key: string]: string
}

let dict: AssetDict = {
  "AVAX": avaxID
};

export default dict;
