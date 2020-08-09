import api from "@/axios";
import { IAssetData } from "./IAsset";
import { profanities } from "@/js/Profanities";
import Big from "big.js";
import { stringToBig } from '@/helper';

class Asset {
    id: string;
    alias: string;
    chainID: string;
    currentSupply: Big;
    denomination: number;
    name: string;
    symbol: string;
    volume_day: Big;
    txCount_day: number;
    profane: boolean;

    constructor(assetData: IAssetData, isUnknown: boolean) {
        this.id = assetData.id;
        this.alias = assetData.alias;
        this.chainID = assetData.chainID;
        // TODO: supply is genesis TX only
        this.currentSupply = Big(assetData.currentSupply).div(Math.pow(10, assetData.denomination));
        this.denomination = assetData.denomination;
        this.name = assetData.name;
        this.symbol = assetData.symbol;
        this.volume_day = Big(0);
        this.txCount_day = 0;
        this.profane = false;
        if (!isUnknown) {
            this.updateVolumeHistory();   
        }
        this.checkForProfanities(this.name);
        this.checkForProfanities(this.symbol);
    }

    // Daily Volume
    private updateVolumeHistory(): void {
        let parent = this;
        let endDate = new Date();
        let startTime = Date.now() - (1000 * 60 * 60 * 24);
        let startDate = new Date(startTime);
        
        // TODO: support service for multiple chains
        api.get(`/x/transactions/aggregates?startTime=${startDate.toISOString()}&endTime=${endDate.toISOString()}&assetID=${this.id}`).then(res => {
            let txCount = res.data.aggregates.transactionCount || 0;
            let txVolume = res.data.aggregates.transactionVolume || "0";
            parent.volume_day = stringToBig(txVolume, parent.denomination);
            parent.txCount_day = txCount;
        });
    }

    private checkForProfanities(value: string): void {
        if (this.profane) {
            return;
        }
        this.profane = profanities.screen(value);
    }
}

export { Asset }
