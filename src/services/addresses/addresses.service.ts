import avalanche_go_api from '@/avalanche_go_api'
import api from '@/axios'
import { bigToDenomBig, getNullAddress, stringToBig } from '@/helper'
import { Asset } from '@/js/Asset'
import { resolveResponseData } from '@/services/helpers'
import { AVAX_ID } from '@/known_assets'
import {
    IAddress,
    IAddressData,
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
import {
    setUnlockedXP,
    setUnlockedX,
    setAssetMetadata,
    setBalanceData,
    setUnlockedXC,
} from './address'
import qs from 'qs'
import { C, P, X } from '@/known_blockchains'

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
            addresses: [`P-${id}`],
            encoding: 'hex',
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
    id: string,
    assetsMap: IAssetsMap
): Promise<IAddress> {
    // Get data from Ortelius and Avalanche-Go
    const [pAddress, xAddress, cAddress, pBalance, pStake] = await Promise.all([
        getAddressFromOrtelius({
            address: id,
            chainID: [P.id],
        }),
        getAddressFromOrtelius({
            address: id,
            chainID: [X.id],
        }),
        getAddressFromOrtelius({
            address: id,
            chainID: [C.id],
        }),
        getBalance_P(id!),
        getStake_P(id!),
    ])

    // Exception where no addresses were found for queried chains
    if (
        pAddress.addresses.length === 0 &&
        xAddress.addresses.length === 0 &&
        cAddress.addresses.length === 0
    ) {
        return getNullAddress(id!)
    }

    // Initialize the address and set the data from Avalanche-Go API
    const address: IAddress = {
        address: id!,
        publicKey: '', // todo

        // P-Chain (excludes X -> P shared memory)
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

        // X -> P shared memory
        XP_unlocked: Big(0),

        // X-Chain (includes P -> X & C -> X shared memory)
        X_assets: [],
        X_unlocked: Big(0),
        X_locked: Big(0),

        // X -> C shared memory
        XC_unlocked: Big(0),
    }

    // Then set data from Ortelius
    const pBalanceOrtelius = pAddress.addresses.filter(
        (a: IAddressData) => a.chainID === P.id
    )
    const xBalanceOrtelius = xAddress.addresses.filter(
        (a: IAddressData) => a.chainID === X.id
    )
    const cBalanceOrtelius = cAddress.addresses.filter(
        (a: IAddressData) => a.chainID === C.id
    )

    // Ortelius pBalance includes UTXOs from P-chain and X -> P shared memory
    // Avala-Go pBalance includes UTXOs from P-chain
    // We subtract one from the other to get balance for X -> P shared memory
    if (pBalanceOrtelius.length > 0) {
        const pBalanceAndXPbalance = bigToDenomBig(
            setUnlockedXP(pBalanceOrtelius[0].assets),
            assetsMap[AVAX_ID].denomination
        )
        address.XP_unlocked = pBalanceAndXPbalance.minus(address.AVAX_balance)
    }

    if (xBalanceOrtelius.length > 0) {
        address.X_assets = setBalances(xBalanceOrtelius[0].assets, assetsMap)
        address.X_unlocked = setUnlockedX(address.X_assets)
    }

    if (cBalanceOrtelius.length > 0) {
        address.XC_unlocked = bigToDenomBig(
            setUnlockedXC(cBalanceOrtelius[0].assets),
            assetsMap[AVAX_ID].denomination
        )
    }

    return address
}
