import { AssetType, IAsset } from './models'

export function getAssetType(asset: IAsset) {
    return asset.nft
        ? AssetType.NFT
        : asset.variableCap
        ? AssetType.VARIABLE_CAP
        : AssetType.FIXED_CAP
}
