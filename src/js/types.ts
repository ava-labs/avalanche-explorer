


// The main Transaction type of the API
export interface ApiTransaction {
    unsignedTx: {
        networkID: number,
        blockchainID: string
    }
    inputs: ApiTransactionInput[],
    outputs: ApiTransactionOutput[]
    id: string,
    timestamp: string,
    type: string,
    chainID: string
}


// Transaction Input type
export interface ApiTransactionInput {
    credentials: ApiCredential
    output: ApiTransactionOutput
}


// Transaction Output type
export interface ApiTransactionOutput {
    addresses: string[],
    amount: number,
    assetID: string,
    id: string,
    locktime: number,
    outputIndex: number,
    outputType: number,
    redeemingTransactionID: string,
    threshold: number,
    timestamp: string,
    transactionID: string
}




export interface ApiCredential {
    signature: string,
    public_key: string,
    address: string
}