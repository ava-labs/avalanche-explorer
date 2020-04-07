

export interface ApiTransaction {
    unsignedTx: {
        networkID: number,
        blockchainID: string
        inputs: ApiTransactionInput[],
        outputs: ApiTransactionOutput[]
    }
    credentials: ApiCredential[]
}


export interface ApiTransactionInput {
    txID: string
    outputIndex: number,
    assetID: string,
    input: {
        amount: number,
        signatureIndices: number[]
    }
}

export interface ApiTransactionOutput {
    assetID: string,
    output: {
        amount: number,
        locktime: number,
        threshold: number,
        addresses: string[]
    }
}

export interface ApiCredential {
    signatures: number[][]
}