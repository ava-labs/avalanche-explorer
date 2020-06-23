import { ICredentialData } from './ICredential';
import Big from "big.js";

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
    amount: string,
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

export interface ITransaction {
    unsignedTx: {
        networkID: number,
        blockchainID: string
    },
    inputs: ITransactionInput[],
    outputs: ITransactionOutput[],
    id: string,
    timestamp: string,
    type: string,
    chainID: string
}

export interface ITransactionInput {
    credentials: ICredentialData,
    output: ITransactionOutput
}

export interface ITransactionOutput {
    addresses: string[],
    amount: Big,
    assetID: string,
    id: string,
    locktime: number,
    outputIndex: number,
    outputType: number,
    redeemingTransactionID: string,
    threshold: number,
    timestamp: Date,
    transactionID: string
}
/*

export interface ITransaction {
    
    id: string,
    timestamp: string,
    type: string,
    chainID: string

    unsignedTx: {
        networkID: number,
        blockchainID: string
    },

    inputs: [
        {
            credentials: ICredentialData,
            output: {
                addresses: string[],
                amount: Big,
                assetID: string,
                id: string,
                locktime: number,
                outputIndex: number,
                outputType: number,
                redeemingTransactionID: string,
                threshold: number,
                timestamp: Date,
                transactionID: string
            }
        }
    ],
    
    outputs: [
        {
            addresses: string[],
            amount: Big,
            assetID: string,
            id: string,
            locktime: number,
            outputIndex: number,
            outputType: number,
            redeemingTransactionID: string,
            threshold: number,
            timestamp: Date,
            transactionID: string
        }
    ],
}


*/

export interface OutputValuesDict {
    [key: string] : {
        symbol: string,
        amount: Big,
        denomination: number
    }
}

export interface outValuesDenominated {
    [assetId: string]: {
        amount: string,
        symbol: string        
    }
}