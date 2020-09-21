import Big from 'big.js';

export interface IAddress {
    address:                            string,    // "custom1wvdqtl8g5jjv2r5rk8qzgktf9kx95nx8fm2xsh
    publicKey:                          string,
    // P-Chain AVAX balance
    AVAX_balance:                       Big,        // ?
    P_unlocked:            Big,
    P_lockedStakeable:     Big,
    P_lockedNotStakeable:  Big,
    P_staked:              Big,
    utxoIDs_P:                            string[],
    // X-Chain AVAX balance
    X_unlocked:            Big,
    X_locked:              Big,
    // X-Chain Assets
    totalTransactionCount:              number,
    totalUtxoCount:                     number,
    assets:                             IBalance_X[],
}

export interface IBalance_X {
    // asset metadata for convenience 
    id:                         string,
    name:                       string,
    symbol:                     string,
    denomination:               number,
    currentSupply?:             Big,
    // balance data
    balance:                    Big,
    proportionOfCurrentSupply?: number,
    totalReceived:              Big,
    totalSent:                  Big
    transactionCount:           number,
    utxoCount:                  number,
}

export interface IBalance_P {
    balance:                    Big,
    unlocked:                   Big,
    lockedStakeable:            Big,
    lockedNotStakeable:         Big,
    utxoIDs:                    string[] | null
}

/* ==========================================
   Ortelius API
        - unlocked X-Chain AVAX
        - unlocked X-Chain assets
        - TODO: locked X-Chain AVAX
        - TODO: locked X-Chain assets
   ========================================== */

export interface IAddressData {
    address:                    string,
    publicKey:                  string,
    assets:                     IBalance_X_Data
}

export interface IBalance_X_Data {
    [key: string]: IBalance_X_Datum
}

export interface IBalance_X_Datum {
    id:                         string,
    transactionCount:           number,
    utxoCount:                  number,
    balance:                    string,
    totalReceived:              string,
    totalSent:                  string
}

/* ==========================================
   Avalanche Go API
        - unlocked P-Chain AVAX
        - locked P-Chain AVAX
        - staked P-Chain AVAX
   ========================================== */

export interface IBalance_P_Data {
    balance:                    string,     // ?
    unlocked:                   string,     // unlocked tokens on P-chain. can stake. can move
    lockedStakeable:            string,     // vesting tokens. can stake. cannot move.
    lockedNotStakeable:         string,     // vesting tokens. cannot stake. cannot move.
    utxoIDs:                    string[] | null
}

// getStake(address[es])
    // one address = one stake balance.
    // many addresses = sum of stake balances.