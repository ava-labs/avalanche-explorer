import avalanche_go_api from '@/avalanche_go_api'
import api from '@/axios'
import { bigToDenomBig, stringToBig } from '@/helper'
import { Asset } from '@/js/Asset'
import { resolveResponseData } from '@/services/helpers'
import { AVAX_ID } from '@/store'
import {
    IAddress,
    IAssetsMap,
    IBalancePData,
    IBalanceX,
    IBalanceXData,
    IBalanceXDatum,
    IStakePData,
} from './models'
import Big from 'big.js'
import { IAssetDataAvalancheGo, IAssetDataOrtelius } from '@/js/IAsset'
import { avm } from '@/avalanche'
import { setUnlockedX, setAssetMetadata, setBalanceData } from './address'
import qs from 'qs'
import { XCHAINID, CCHAINID } from '@/known_blockchains'

const ADDRESSES_V2_API_BASE_URL = process.env.VUE_APP_ADDRESSES_V2_API_BASE_URL

export interface IAddressesParams {
    address?: string
    chainID?: string[]
    sort?: string
    offset?: number
    limit?: number
}

/**
 * @dev put addressID as a param
 */
export function getAddressFromOrtelius(params?: IAddressesParams) {
    return api
        .get(`${ADDRESSES_V2_API_BASE_URL}`, {
            params,
            paramsSerializer: (params) =>
                qs.stringify(params, { arrayFormat: 'repeat' }),
        })
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
    const result: IBalancePData = res.data.result
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
    const result: IStakePData = res.data.result
    return result
}

function setBalances(
    balanceData: IBalanceXData,
    assetsMap: any
): [IBalanceX[], number, number] {
    const balances: IBalanceX[] = []
    let totalTransactionCount = 0
    let totalUtxoCount = 0

    /**
     * For each balance in the address's portfolio, get and set:
     * - asset metadata
     * - balance data (relies on asset metadata)
     * - balances metadata
     */
    for (const assetID in balanceData) {
        const balanceDatum: IBalanceXDatum = balanceData[assetID]

        // init the balance
        const balance: IBalanceX = {
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
                    const asset: IAssetDataOrtelius = res.data

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
                        (res: IAssetDataAvalancheGo) => {
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

/**
 *
 * @param id
 * @param assetsMap
 * @param params
 * @returns balances for an address
 */
export async function getAddress(
    id: string,
    assetsMap: IAssetsMap,
    params: IAddressesParams
) {
    // Get data from Ortelius and Avalanche-Go
    const [addressData, pBalanceData, pStakeData] = await Promise.all([
        getAddressFromOrtelius(params),
        getBalance_P(id),
        getStake_P(id),
    ])

    const balances = addressData.addresses.filter(
        // @ts-ignore
        (address) => address.chainID === XCHAINID
    )

    // TODO - exception for no X
    // if (balances.length === 0) {
    //     balances = addressData.addresses.filter(
    //         // @ts-ignore
    //         (address) => address.chainID === CCHAINID
    //     )
    // }

    const [assets, totalTransactionCount, totalUtxoCount] = setBalances(
        balances[0].assets,
        assetsMap
    )

    // Exception for C- address with no data
    if (addressData.addresses.length === 0) {
        const nullData: IAddress = {
            address: id,
            publicKey: '',
            // P-Chain AVAX balance
            AVAX_balance: Big(0),
            P_unlocked: Big(0),
            P_lockedStakeable: Big(0),
            P_lockedNotStakeable: Big(0),
            P_staked: Big(0),
            P_utxoIDs: [],
            // X-Chain AVAX balance
            X_unlocked: Big(0),
            X_locked: Big(0),
            // X-Chain Assets
            totalTransactionCount: 0,
            totalUtxoCount: 0,
            assets: [],
        }
        return nullData
    }

    const address: IAddress = {
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
        X_unlocked: setUnlockedX(assets),
        X_locked: Big(0),
    }
    return address
}
