import { ICredentialData } from './ICredential';

// The main Transaction type of the API
export interface ITransactionData {
    unsignedTx: {
        networkID: number,
        blockchainID: string
    },
    inputs: ITransactionInputData[],
    outputs: ITransactionOutputData[],
    id: string,
    timestamp: string,
    type: string,
    chainID: string
}

// Transaction Input type
export interface ITransactionInputData {
    credentials: ICredentialData,
    output: ITransactionOutputData
}

// Transaction Output type
export interface ITransactionOutputData {
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
