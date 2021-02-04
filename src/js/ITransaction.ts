import { ICredentialData } from './ICredential'
import Big from 'big.js'

export interface ITransactionDataResponse {
    startTime: string
    endTime: string
    next: string
    transactions: ITransactionData[]
}

// The main Transaction type of the API
export interface ITransactionData {
    id: string
    chainID: string
    type: string

    inputs: ITransactionInputData[]
    outputs: ITransactionOutputData[]

    memo: string // base64

    inputTotals: IInputTotal
    outputTotals: IOutputTotal
    reusedAddressTotals: string | null

    timestamp: string

    txFee: number

    genesis: boolean

    rewarded: boolean
    rewardedTime: string | null

    epoch: number

    vertexId: string

    validatorNodeID: string
    validatorStart: number
    validatorEnd: number

    txBlockId: string
}

export interface IInputTotal {
    [key: string]: number
}

export interface IOutputTotal {
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
    chainID: string
    groupID: number
    id: string
    locktime: number
    outputIndex: number
    outputType: number
    payload: string
    redeemingTransactionID: string
    stakeLocktime: number
    threshold: number
    timestamp: string
    transactionID: string
}

export interface ITransaction {
    id: string
    chainID: string
    type: string

    inputs: ITransactionInput[]
    outputs: ITransactionOutput[]

    memo: string // base64

    inputTotals: IInputTotal
    outputTotals: IOutputTotal
    reusedAddressTotals?: string | null

    timestamp: string

    txFee: number

    genesis: boolean

    rewarded: boolean
    rewardedTime: string | null

    epoch: number

    vertexId: string

    validatorNodeID: string
    validatorStart: number
    validatorEnd: number

    txBlockId: string
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

export interface IOutValuesDenominated {
    [assetId: string]: {
        amount: string
        symbol: string
    }
}
