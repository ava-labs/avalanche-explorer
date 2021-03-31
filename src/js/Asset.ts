import { IAssetDataOrtelius } from './IAsset'
import { profanities } from '@/js/Profanities'
import Big from 'big.js'
import { stringToBig } from '@/helper'
import store from '../store'
import { IAggregate } from '@/services/aggregates'

class Asset {
    id: string
    alias: string
    chainID: string
    currentSupply: Big
    denomination: number
    name: string
    symbol: string
    timestamp: string
    variableCap: number
    nft: number
    aggregates: IAggregate | null
    // aggregate data
    volume_day: Big
    txCount_day: number
    addressCount_day: number
    outputCount_day: number
    isHistoryUpdated: boolean
    // FE metadata
    profane: boolean
    // not in indexer
    isUnknown: boolean

    constructor(assetData: IAssetDataOrtelius, isUnknown: boolean) {
        this.id = assetData.id
        this.alias = assetData.alias
        this.chainID = assetData.chainID
        // TODO: supply is genesis TX only
        this.currentSupply = Big(assetData.currentSupply).div(
            Math.pow(10, assetData.denomination)
        )
        this.denomination = assetData.denomination
        this.name = assetData.name
        this.symbol = assetData.symbol
        this.timestamp = assetData.timestamp
        this.variableCap = assetData.variableCap
        this.nft = assetData.nft
        this.aggregates = assetData.aggregates
        // aggregate data
        this.volume_day = Big(0)
        this.txCount_day = 0
        this.addressCount_day = 0
        this.outputCount_day = 0
        this.isHistoryUpdated = false
        // not in indexer
        this.isUnknown = isUnknown
        // FE metadata
        this.profane = false
        this.checkForProfanities(this.name)
        this.checkForProfanities(this.symbol)
    }

    // Daily Volume
    public updateAggregates(assetAggregate: IAggregate): void {
        if (this.isUnknown === false) {
            this.volume_day = stringToBig(
                assetAggregate.transactionVolume,
                this.denomination
            )
            this.txCount_day = assetAggregate.transactionCount
            this.addressCount_day = assetAggregate.addressCount
            this.outputCount_day = assetAggregate.outputCount
            this.isHistoryUpdated = true
            store.commit('updateAssetInSubsetForAggregation', this.id)
        }
    }

    private checkForProfanities(value: string): void {
        if (this.profane) {
            return
        }
        this.profane = profanities.screen(value)
    }
}

export { Asset }
