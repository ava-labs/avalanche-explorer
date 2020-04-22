

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


    constructor(assetData: AssetData) {
        this.id = assetData.id;
        this.alias = assetData.alias;
        this.chainID = assetData.chainID;
        this.currentSupply = assetData.currentSupply;
        this.denomination = assetData.denomination;
        this.name = assetData.name;
        this.symbol = assetData.symbol;
    }
}

export {Asset}
