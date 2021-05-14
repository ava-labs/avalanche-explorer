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

export function getAddressFromOrtelius(params?: IAddressesParams) {
    return api
        .get(`${ADDRESSES_V2_API_BASE_URL}`, {
            params,
            paramsSerializer: (params) =>
                qs.stringify(params, { arrayFormat: 'repeat' }),
        })
        .then(resolveResponseData)
}

export async function getBalance_P(id: string): Promise<IBalancePData> {
    const res = await avalanche_go_api.post('', {
        jsonrpc: '2.0',
        method: 'platform.getBalance',
        params: {
            address: `P-${id}`,
        },
        id: 1,
    })
    return res.data.result
}

export async function getStake_P(id: string): Promise<IStakePData> {
    const res = await avalanche_go_api.post('', {
        jsonrpc: '2.0',
        method: 'platform.getStake',
        params: {
            address: `P-${id}`,
        },
        id: 1,
    })
    return res.data.result
}

function setBalances(balanceData: IBalanceXData, assetsMap: any): IBalanceX[] {
    const balances: IBalanceX[] = []

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
    }

    return balances
}

/**
 * @param params should contain addressID and chainIDs
 * @param assetsMap used to decode asset balances
 * @returns balances for a bech32 address, across three dimensions
 *  - type: staked, locked, unlocked
 *  - on-chain balances: X, C and/or P
 *  - shared memory balances: P/X, X/C
 */
export async function getAddress(
    params: IAddressesParams,
    assetsMap: IAssetsMap
): Promise<IAddress> {
    // Get data from Ortelius and Avalanche-Go
    const [addressData, pBalance, pStake] = await Promise.all([
        getAddressFromOrtelius(params),
        getBalance_P(params.address!),
        getStake_P(params.address!),
    ])

    // Parse addressData from Ortelius
    // Check for X
    // Check for C

    const xBalanceOrtelius = addressData.addresses.filter(
        // @ts-ignore
        (a) => a.chainID === XCHAINID
    )

    // TODO - exception for no X
    // if (balances.length === 0) {
    //     balances = addressData.addresses.filter(
    //         // @ts-ignore
    //         (address) => address.chainID === CCHAINID
    //     )
    // }

    const assets = setBalances(xBalanceOrtelius[0].assets, assetsMap)

    // Exception for C- address with no data
    if (addressData.addresses.length === 0) {
        const nullData: IAddress = {
            address: params.address!,
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
            assets: [],
        }
        return nullData
    }

    const address: IAddress = {
        address: addressData.address,
        publicKey: addressData.publicKey,
        // P-Chain balance (AVAX)
        AVAX_balance: bigToDenomBig(
            new Big(pBalance.balance),
            assetsMap[AVAX_ID].denomination
        ),
        P_unlocked: bigToDenomBig(
            new Big(pBalance.unlocked),
            assetsMap[AVAX_ID].denomination
        ),
        P_lockedStakeable: bigToDenomBig(
            new Big(pBalance.lockedStakeable),
            assetsMap[AVAX_ID].denomination
        ),
        P_lockedNotStakeable: bigToDenomBig(
            new Big(pBalance.lockedNotStakeable),
            assetsMap[AVAX_ID].denomination
        ),
        P_staked: bigToDenomBig(
            new Big(pStake.staked),
            assetsMap[AVAX_ID].denomination
        ),
        P_utxoIDs: pBalance.utxoIDs as string[],
        // P-Chain balances (AVAX, etc.)
        assets,
        X_unlocked: setUnlockedX(assets),
        X_locked: Big(0),
    }
    return address
}
