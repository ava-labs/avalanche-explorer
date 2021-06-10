import { stringToBig } from '@/helper'
import { Asset } from '@/js/Asset'
import { IAssetDataOrtelius, IAssetDataAvalancheGo } from '@/js/IAsset'
import { AVAX_ID } from '@/known_assets'
import { IBalanceX, IBalanceXData, IBalanceXDatum } from './models'
import Big from 'big.js'

// set asset metadata for convenience
export function setAssetMetadata(
    asset: Asset | IAssetDataOrtelius | IAssetDataAvalancheGo,
    balance: IBalanceX
) {
    balance.name = asset.name
    balance.denomination = asset.denomination
    balance.symbol = asset.symbol
}

// set balance data (relies on asset metadata)
export function setBalanceData(
    balanceDatum: IBalanceXDatum,
    denomination: number,
    balance: IBalanceX
) {
    balance.balance = stringToBig(balanceDatum.balance, denomination)
    balance.totalReceived = stringToBig(
        balanceDatum.totalReceived,
        denomination
    )
    balance.totalSent = stringToBig(balanceDatum.totalSent, denomination)
}

export function setUnlockedXP(assets: IBalanceXData): Big {
    return assets[AVAX_ID] ? Big(assets[AVAX_ID].balance) : Big(0)
}

export function setUnlockedX(assets: IBalanceX[]): Big {
    const result = assets.find((asset) => asset.id === AVAX_ID)
    return result ? result.balance : Big(0)
}

export function setUnlockedXC(assets: IBalanceXData): Big {
    return assets[AVAX_ID] ? Big(assets[AVAX_ID].balance) : Big(0)
}
