import { ICredentialData } from './ICredential'
import Big from 'big.js'

// The main Transaction type of the API
export interface ITransactionData {
    id: string
    chainID: string
    type: string
    inputs: ITransactionInputData[]
    outputs: ITransactionOutputData[]
    inputTotals?: IInputTotal // TODO new stuff
    outputTotals?: IOutputTotal // TODO new stuff
    reusedAddressTotals?: string // TODO new stuff
    memo: string // base64
    timestamp: string
}

interface IInputTotal {
    [key: string]: number
}

interface IOutputTotal {
    [key: string]: number
}

// Transaction Input type
export interface ITransactionInputData {
    credentials: ICredentialData
    output: ITransactionOutputData
}

// Transaction Output type
export interface ITransactionOutputData {
    addresses: string[]
    amount: string
    assetID: string
    id: string
    locktime: number
    outputIndex: number
    outputType: number
    redeemingTransactionID: string
    threshold: number
    timestamp: string
    transactionID: string
}

export interface ITransaction {
    inputs: ITransactionInput[]
    outputs: ITransactionOutput[]
    id: string
    timestamp: string
    type: string
    chainID: string
    memo: string // base64
}

export interface ITransactionInput {
    credentials: ICredentialData
    output: ITransactionOutput
}

export interface ITransactionOutput {
    addresses: string[]
    amount: Big
    assetID: string
    id: string
    locktime: number
    outputIndex: number
    outputType: number
    redeemingTransactionID: string
    threshold: number
    timestamp: Date
    transactionID: string
}

export interface OutputValuesDict {
    [key: string]: {
        symbol: string
        amount: Big
        denomination: number
    }
}

export interface outValuesDenominated {
    [assetId: string]: {
        amount: string
        symbol: string
    }
}
