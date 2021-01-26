import avalanche_go_api from '@/avalanche_go_api'
import api from '@/axios'
import { bigToDenomBig, stringToBig } from '@/helper'
import { Asset } from '@/js/Asset'
import { resolveResponseData } from '@/services/helpers'
import { AVAX_ID } from '@/store'
import {
    IAddress,
    IAssetsMap,
    IBalance_P_Data,
    IBalance_X,
    IBalance_X_Data,
    IBalance_X_Datum,
    IStake_P_Data,
} from './models'
import Big from 'big.js'
import { IAssetData_Avalanche_Go, IAssetData_Ortelius } from '@/js/IAsset'
import { avm } from '@/avalanche'

const ADDRESSES_V2_API_BASE_URL = process.env.VUE_APP_ADDRESSES_V2_API_BASE_URL

export interface IAddressesParams {
    chainID?: string[]

    sort?: string
    offset?: number
    limit?: number
}

// export type Combo = ITransactionParams & IAddressesParams

export async function getAddress(id: string, assetsMap: IAssetsMap) {
    const [addressData, pBalanceData, pStakeData] = await Promise.all([
        getAddressFromOrtelius(id),
        getBalance_P(id),
        getStake_P(id),
    ])

    let [assets, totalTransactionCount, totalUtxoCount] = setBalances_X(
        addressData.assets,
        assetsMap
    )

    let address: IAddress = {
        address: addressData.address,
        publicKey: addressData.publicKey,
        // P-Chain balance (AVAX)
        AVAX_balance: bigToDenomBig(
            new Big(pBalanceData.balance),
            assetsMap[AVAX_ID].denomination
        ),
        P_unlocked: bigToDenomBig(
            new Big(pBalanceData.unlocked),
            assetsMap[AVAX_ID].denomination
        ),
        P_lockedStakeable: bigToDenomBig(
            new Big(pBalanceData.lockedStakeable),
            assetsMap[AVAX_ID].denomination
        ),
        P_lockedNotStakeable: bigToDenomBig(
            new Big(pBalanceData.lockedNotStakeable),
            assetsMap[AVAX_ID].denomination
        ),
        P_staked: bigToDenomBig(
            new Big(pStakeData.staked),
            assetsMap[AVAX_ID].denomination
        ),
        P_utxoIDs: pBalanceData.utxoIDs as string[],
        // P-Chain balances (AVAX, etc.)
        assets,
        totalTransactionCount,
        totalUtxoCount,
        X_unlocked: set_X_unlocked(assets),
        X_locked: Big(0),
    }
    return address
}

export function getAddressFromOrtelius(id: string, params?: IAddressesParams) {
    return api
        .get(`${ADDRESSES_V2_API_BASE_URL}/${id}`, { params })
        .then(resolveResponseData)
}

export async function getBalance_P(id: string) {
    const req = {
        jsonrpc: '2.0',
        method: 'platform.getBalance',
        params: {
            address: `P-${id}`,
        },
        id: 1,
    }
    const res = await avalanche_go_api.post('', req)
    const result: IBalance_P_Data = res.data.result
    return result
}

export async function getStake_P(id: string) {
    const req = {
        jsonrpc: '2.0',
        method: 'platform.getStake',
        params: {
            address: `P-${id}`,
        },
        id: 1,
    }
    const res = await avalanche_go_api.post('', req)
    const result: IStake_P_Data = res.data.result
    return result
}

function setBalances_X(
    balanceData: IBalance_X_Data,
    assetsMap: any
): [IBalance_X[], number, number] {
    const balances: IBalance_X[] = []
    let totalTransactionCount = 0
    let totalUtxoCount = 0

    /**
     * For each balance in the address's portfolio, get and set:
     * - asset metadata
     * - balance data (relies on asset metadata)
     * - balances metadata
     */
    for (const assetID in balanceData) {
        const balanceDatum: IBalance_X_Datum = balanceData[assetID]

        // init the balance
        const balance: IBalance_X = {
            id: assetID,
            name: '',
            denomination: 0,
            symbol: '',
            currentSupply: Big(0),
            balance: Big(balanceDatum.balance), // initially undenominated
            totalReceived: Big(balanceDatum.totalReceived), // initially undenominated
            totalSent: Big(balanceDatum.totalSent), // initially undenominated
            proportionOfCurrentSupply: 0,
            transactionCount: balanceDatum.transactionCount,
            utxoCount: balanceDatum.utxoCount,
        }

        // If asset exists in store
        if (assetsMap[assetID]) {
            const asset: Asset = assetsMap[assetID]

            setAssetMetadata(asset, balance)
            setBalanceData(balanceDatum, balance.denomination, balance)
            balance.currentSupply = asset.currentSupply
            balance.proportionOfCurrentSupply = Math.round(
                (parseInt(balanceDatum.balance) /
                    parseInt(asset.currentSupply.toString())) *
                    100
            )
        }

        // If asset does not exist in store
        if (!assetsMap[assetID]) {
            // Try Ortelius
            api.get(`/x/assets/${assetID}`).then((res) => {
                if (res.data) {
                    console.log('FOUND ASSET IN ORTELIUS', res.data)
                    const asset: IAssetData_Ortelius = res.data

                    setAssetMetadata(asset, balance)
                    setBalanceData(balanceDatum, balance.denomination, balance)
                    balance.currentSupply = stringToBig(
                        asset.currentSupply,
                        balance.denomination
                    )
                    balance.proportionOfCurrentSupply = Math.round(
                        (parseInt(balanceDatum.balance) / parseInt('0')) * 100
                    )
                } else if (!res.data) {
                    // Try Avalanche-Go as last resort
                    avm.getAssetDescription(assetID).then(
                        (res: IAssetData_Avalanche_Go) => {
                            if (res) {
                                console.log('FOUND ASSET IN GECKO', res)
                                const asset = res

                                setAssetMetadata(asset, balance)
                                setBalanceData(
                                    balanceDatum,
                                    balance.denomination,
                                    balance
                                )
                                balance.currentSupply = stringToBig(
                                    '0',
                                    balance.denomination
                                )
                                balance.proportionOfCurrentSupply = Math.round(
                                    (parseInt(balanceDatum.balance) /
                                        parseInt('0')) *
                                        100
                                )
                            }
                        }
                    )
                }
            })
        }

        balances.push(balance)

        // update balances metadata
        totalTransactionCount += balance.transactionCount
        totalUtxoCount += balance.utxoCount
    }

    return [balances, totalTransactionCount, totalUtxoCount]
}

// set asset metadata for convenience
function setAssetMetadata(
    asset: Asset | IAssetData_Ortelius | IAssetData_Avalanche_Go,
    balance: IBalance_X
) {
    balance.name = asset.name
    balance.denomination = asset.denomination
    balance.symbol = asset.symbol
}

// set balance data (relies on asset metadata)
function setBalanceData(
    balanceDatum: IBalance_X_Datum,
    denomination: number,
    balance: IBalance_X
) {
    balance.balance = stringToBig(balanceDatum.balance, denomination)
    balance.totalReceived = stringToBig(
        balanceDatum.totalReceived,
        denomination
    )
    balance.totalSent = stringToBig(balanceDatum.totalSent, denomination)
}

function set_X_unlocked(assets: IBalance_X[]): Big {
    const result = assets.find((asset) => asset.id === AVAX_ID)
    return result ? result.balance : Big(0)
}
