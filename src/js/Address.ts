import {
    IBalance_X_Data,
    IBalance_X_Datum,
    IBalance_X,
    IAddressData,
    IBalance_P_Data,
    IBalance_P,
    IStake_P_Data,
} from './IAddress'
import { stringToBig, bigToDenomBig } from '@/helper'
import { Asset } from './Asset'
import Big from 'big.js'
import api from '@/axios'
import { avm } from '@/avalanche'
import { AVAX_ID } from '@/store/index'
import { IAssetData_Ortelius, IAssetData_Avalanche_Go } from './IAsset'

interface IAssetsMap {
    [key: string]: Asset
}

export default class Address {
    address: string
    publicKey: string
    // P-Chain AVAX balance
    AVAX_balance: Big
    P_unlocked: Big
    P_lockedStakeable: Big
    P_lockedNotStakeable: Big
    P_staked: Big
    P_utxoIDs: string[]
    // X-Chain AVAX balance
    X_unlocked: Big
    X_locked: Big
    // X-Chain Assets
    totalTransactionCount: number
    totalUtxoCount: number
    assets: IBalance_X[]

    constructor(data: IAddressData, assetsMap: IAssetsMap) {
        this.address = data.address
        this.publicKey = data.publicKey
        // P-Chain AVAX balance
        this.AVAX_balance = Big(0)
        this.P_unlocked = Big(0)
        this.P_lockedStakeable = Big(0)
        this.P_lockedNotStakeable = Big(0)
        this.P_staked = Big(0)
        this.P_utxoIDs = []
        // X-Chain AVAX balance
        this.X_unlocked = Big(0)
        this.X_locked = Big(0)
        // X-Chain Assets
        this.totalTransactionCount = 0
        this.totalUtxoCount = 0
        this.assets = this.set_asset_balances_unlocked_X(data.assets, assetsMap)

        this.set_X_unlocked()
    }

    private set_asset_balances_unlocked_X(
        balanceData: IBalance_X_Data,
        assetsMap: any
    ): IBalance_X[] {
        let balances: IBalance_X[] = []

        /**
         * For each balance in the address's portfolio, get and set:
         * - asset metadata
         * - balance data (relies on asset metadata)
         * - balances metadata
         */
        for (const assetID in balanceData) {
            let balanceDatum: IBalance_X_Datum = balanceData[assetID]

            // init the balance
            let balance: IBalance_X = {
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
                let asset: Asset = assetsMap[assetID]

                this.setAssetMetadata(asset, balance)
                this.setBalanceData(balanceDatum, balance.denomination, balance)
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
                        let asset: IAssetData_Ortelius = res.data

                        this.setAssetMetadata(asset, balance)
                        this.setBalanceData(
                            balanceDatum,
                            balance.denomination,
                            balance
                        )
                        balance.currentSupply = stringToBig(
                            asset.currentSupply,
                            balance.denomination
                        )
                        balance.proportionOfCurrentSupply = Math.round(
                            (parseInt(balanceDatum.balance) / parseInt('0')) *
                                100
                        )
                    } else if (!res.data) {
                        // Try Avalanche-Go as last resort
                        avm.getAssetDescription(assetID).then(
                            (res: IAssetData_Avalanche_Go) => {
                                if (res) {
                                    console.log('FOUND ASSET IN GECKO', res)
                                    let asset = res

                                    this.setAssetMetadata(asset, balance)
                                    this.setBalanceData(
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
            this.totalTransactionCount += balance.transactionCount
            this.totalUtxoCount += balance.utxoCount
        }

        return balances
    }

    // set asset metadata for convenience
    private setAssetMetadata(
        asset: Asset | IAssetData_Ortelius | IAssetData_Avalanche_Go,
        balance: IBalance_X
    ) {
        balance.name = asset.name
        balance.denomination = asset.denomination
        balance.symbol = asset.symbol
    }

    // set balance data (relies on asset metadata)
    private setBalanceData(
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

    private set_X_unlocked(): void {
        let result = this.assets.find((asset) => asset.id === AVAX_ID)
        if (result) {
            this.X_unlocked = result.balance
        }
    }

    public set_AVAX_balance_P(balance_P_data: IBalance_P_Data): void {
        if (balance_P_data) {
            this.AVAX_balance = bigToDenomBig(
                new Big(balance_P_data.balance),
                9
            )
            this.P_unlocked = bigToDenomBig(new Big(balance_P_data.unlocked), 9)
            this.P_lockedStakeable = bigToDenomBig(
                new Big(balance_P_data.lockedStakeable),
                9
            )
            this.P_lockedNotStakeable = bigToDenomBig(
                new Big(balance_P_data.lockedNotStakeable),
                9
            )
            this.P_utxoIDs = balance_P_data.utxoIDs as string[]
        }
    }

    public set_AVAX_staked_P(stake_P_data: IStake_P_Data): void {
        if (stake_P_data) {
            this.P_staked = bigToDenomBig(new Big(stake_P_data.staked), 9)
        }
    }
}
