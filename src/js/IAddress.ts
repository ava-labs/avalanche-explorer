import Big from 'big.js';

export interface IAddress {
    address: string,
    publicKey: string,
    assets: IBalance[],
    avaxBalance: Big,
    totalTransactionCount: number,
    totalUtxoCount: number
}

export interface IBalance {
    // asset metadata for convenience 
    id: string,
    name: string,
    symbol: string,
    denomination: number,
    currentSupply?: Big,
    // balance data
    balance: Big,
    proportionOfCurrentSupply?: number,
    totalReceived: Big,
    totalSent: Big
    transactionCount: number,
    utxoCount: number,
}

export interface IAddressData {
    address: string,
    publicKey: string,
    assets: IBalanceData
}

export interface IBalanceData {
    [key: string]: {
        id: string,
        transactionCount: number,
        utxoCount: number,
        balance: string,
        totalReceived: string,
        totalSent: string
    }
}
