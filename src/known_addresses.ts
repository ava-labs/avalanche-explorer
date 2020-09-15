const avaxFaucetID = process.env.VUE_APP_AVALANCHE_JS_ID;

interface AddressDict {
  [key: string]: string
}

let dict: AddressDict = {
  faucetAddress: "The AVAX Faucet"
};

export default dict;
