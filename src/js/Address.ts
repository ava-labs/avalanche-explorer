import { IBalanceData, IBalance, IAddressData } from "./IAddress";
import { stringToBig } from "@/helper";
import { Asset } from './Asset';
import Big from "big.js";

interface IAssetsMap {
    [key: string] : Asset;
}

export default class Address {
    address: string;
    publicKey: string;
    assets: IBalance[];
    avaxBalance: Big;
    totalTransactionCount: number;
    totalUtxoCount: number

    constructor(data: IAddressData, assetsMap: IAssetsMap) {
        this.address = data.address;
        this.publicKey = data.publicKey;
        this.avaxBalance = Big(0);
        this.totalTransactionCount = 0;
        this.totalUtxoCount = 0;

        this.assets = this.setBalances(data.assets, assetsMap);
        this.setAVAXBalance();
    }

    private setBalances(balanceData: IBalanceData, assetsMap: any): IBalance[] {
        let balances: IBalance[] = [];
        
        for (const assetID in balanceData) {
            let balance: IBalance = {
                id: "",
                name: "",
                denomination: 0,
                symbol: "",
                currentSupply: Big(0),
                balance: Big(0),
                totalReceived: Big(0),
                totalSent: Big(0),
                proportionOfCurrentSupply: 0,
                transactionCount: 0,
                utxoCount: 0
            };

            // TODO: exception when asset is not found (try Ortelius and Avalanche-Go)
            if (assetsMap[assetID]) {
                // asset metadata for convenience 
                balance.id = assetsMap[assetID].id;
                balance.name = assetsMap[assetID].name;
                balance.denomination = assetsMap[assetID].denomination;
                balance.symbol = assetsMap[assetID].symbol;
                balance.currentSupply = stringToBig(assetsMap[assetID].currentSupply, balance.denomination);
                // balance data
                balance.balance = stringToBig(balanceData[assetID].balance, balance.denomination);
                balance.totalReceived = stringToBig(balanceData[assetID].totalReceived, balance.denomination);
                balance.totalSent = stringToBig(balanceData[assetID].totalSent, balance.denomination);
                balance.proportionOfCurrentSupply = Math.round(((parseInt(balanceData[assetID].balance) / parseInt(assetsMap[assetID].currentSupply)) * 100));
                balance.transactionCount = balanceData[assetID].transactionCount;
                balance.utxoCount = balanceData[assetID].utxoCount;
                // balances metadata
                this.totalTransactionCount += balance.transactionCount;
                this.totalUtxoCount += balance.utxoCount;
            }

            balances.push(balance);
        }

        return balances;
    }

    private setAVAXBalance(): void {
        let result = this.assets.find(asset => asset.id === "21d7KVtPrubc5fHr6CGNcgbUb4seUjmZKr35ZX7BZb5iP8pXWA");
        if (result) {
            this.avaxBalance = result.balance;
        }
    }
}
