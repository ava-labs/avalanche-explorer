import Big from 'big.js';

export interface IAddress {
    address: string,
    publicKey: string,
    assets: IBalance[],
    avaxBalance: number,
  }

export interface IBalance {
    [key: string]: {
        id: string,
        transactionCount: number,
        utxoCount: number,
        balance: Big,
        totalReceived: Big,
        totalSent: Big
      },
}

export interface IAddressData {
    address: string,
    publicKey: string,
    assets: IBalanceData[]
}

export interface IBalanceData {
    [key: string]: {
        id: string,
        transactionCount: number,
        utxoCount: number,
        balance: string,
        totalReceived: string,
        totalSent: string
      },
}