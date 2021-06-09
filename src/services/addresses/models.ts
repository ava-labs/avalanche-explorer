import { Asset } from '@/js/Asset'
import Big from 'big.js'

export interface IAddress {
    address: string // "custom1wvdqtl8g5jjv2r5rk8qzgktf9kx95nx8fm2xsh
    publicKey: string
    // P-Chain (excludes X -> P shared memory)
    AVAX_balance: Big
    P_unlocked: Big // unlocked tokens. stake/move (denominated)
    P_lockedStakeable: Big // vesting tokens. stake/!move (denominated)
    P_lockedNotStakeable: Big // vesting tokens. !stake/!move (denominated)
    P_staked: Big // staked tokens. from getStake (denominated)
    P_utxoIDs: string[]
    // X -> P shared memory
    XP_unlocked: Big
    // X-Chain (includes C -> X and P -> X shared memory)
    X_unlocked: Big
    X_locked: Big
    X_assets: IBalanceX[]
    // X -> C shared memory
    XC_unlocked: Big
}

export interface IBalanceX {
    // asset metadata for convenience
    id: string
    name: string
    symbol: string
    denomination: number
    currentSupply?: Big
    // balance data
    balance: Big
    proportionOfCurrentSupply?: number
    totalReceived: Big
    totalSent: Big
    transactionCount: number
    utxoCount: number
}

export interface IBalanceP {
    balance: Big
    unlocked: Big
    lockedStakeable: Big
    lockedNotStakeable: Big
    utxoIDs: string[] | null
}

/* ==========================================
   Ortelius API
        - unlocked X-Chain AVAX + assets
        - TODO: locked eventually
   ========================================== */

export interface IAddressData {
    address: string
    publicKey: string
    assets: IBalanceXData
    chainID: string
}

export interface IBalanceXData {
    [key: string]: IBalanceXDatum
}

export interface IBalanceXDatum {
    id: string
    transactionCount: number
    utxoCount: number
    balance: string
    totalReceived: string
    totalSent: string
}

/* ==========================================
   Avalanche Go API
        - unlocked P-Chain AVAX
        - locked P-Chain AVAX
        - staked P-Chain AVAX
   ========================================== */

export interface IBalancePData {
    balance: string
    unlocked: string // unlocked tokens. stake/move (no denom)
    lockedStakeable: string // vesting tokens. stake/!move (no denom)
    lockedNotStakeable: string // vesting tokens. !stake/!move (no denom)
    utxoIDs: string[] | null
}

export interface IStakePData {
    staked: string
    stakedOutputs: string[]
}

export interface IAssetsMap {
    [key: string]: Asset
}
