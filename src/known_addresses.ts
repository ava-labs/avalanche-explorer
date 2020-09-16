const defaultNetworkID = parseInt(process.env.VUE_APP_DEFAULT_NETWORKID || "4");

const avaxFaucetID = (defaultNetworkID === 0) 
  ? process.env.VUE_APP_FAUCETADDRESS as string
  : process.env.VUE_APP_TEST_FAUCETADDRESS as string;

interface AddressDict {
  [key: string]: string
}

let dict: AddressDict = {};

dict[avaxFaucetID] = "The AVAX Faucet";

export default dict;
