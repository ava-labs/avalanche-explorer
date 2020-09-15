const avaxID = process.env.VUE_APP_AVAXID;

interface AssetDict {
  [key: string]: string
}

let dict: AssetDict = {
  "AVAX": avaxID as string
};

export default dict;
