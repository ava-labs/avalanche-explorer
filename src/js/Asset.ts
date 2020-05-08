import api from '@/axios';

interface AssetData {
    id: string;
    alias: string;
    chainID: string;
    currentSupply: number;
    denomination: number;
    name: string;
    symbol: string;
}


class Asset {
    id: string;
    alias: string;
    chainID: string;
    currentSupply: number;
    denomination: number;
    name: string;
    symbol: string;
    volume_day: string;
    txCount_day: number;


    constructor(assetData: AssetData) {
        this.id = assetData.id;
        this.alias = assetData.alias;
        this.chainID = assetData.chainID;
        this.currentSupply = assetData.currentSupply;
        this.denomination = assetData.denomination;
        this.name = assetData.name;
        this.symbol = assetData.symbol;
        this.volume_day = '0';
        this.txCount_day = 0;

        this.updateVolumeHistory();
    }


    // Daily Volume
    updateVolumeHistory(){
        let parent = this;
        let endDate = new Date();
        let startTime = Date.now() - (1000 *60 * 60 * 24);
        let startDate = new Date(startTime);

        api.get(`/x/transactions/aggregates?startTime=${startDate.toISOString()}&endTime=${endDate.toISOString()}&assetID=${this.id}`).then(res => {
            let txCount = res.data.aggregates.transactionCount;
            let txVolume = res.data.aggregates.transactionVolume;
            parent.volume_day = txVolume;
            parent.txCount_day = txCount;

            // console.log(res.data);
        });
    }
}

export {Asset}
