import { IBalanceData, IBalanceDatum, IBalance, IAddressData } from "./IAddress";
import { stringToBig } from "@/helper";
import { Asset } from './Asset';
import Big from "big.js";
import api from "@/axios";
import { avm } from '@/avalanche';
import { AVAX_ID } from "@/store/index";
import { IAssetData_Ortelius, IAssetData_Avalanche_Go } from './IAsset';

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

        /**
         * For each balance in the address's portfolio, get and set:
         * - asset metadata
         * - balance data (relies on asset metadata) 
         * - balances metadata
         */
        for (const assetID in balanceData) {
            let balanceDatum: IBalanceDatum = balanceData[assetID];
            
            // init the balance
            let balance: IBalance = {
                id: assetID,
                name: "",
                denomination: 0,
                symbol: "",
                currentSupply: Big(0),
                balance: Big(balanceDatum.balance),                 // initially undenominated
                totalReceived: Big(balanceDatum.totalReceived),     // initially undenominated
                totalSent: Big(balanceDatum.totalSent),             // initially undenominated
                proportionOfCurrentSupply: 0,
                transactionCount: balanceDatum.transactionCount,
                utxoCount: balanceDatum.utxoCount
            };

            // If asset exists in store
            if (assetsMap[assetID]) {
                let asset: Asset = assetsMap[assetID];
                
                this.setAssetMetadata(asset, balance);
                this.setBalanceData(balanceDatum, balance.denomination, balance);
                balance.currentSupply = asset.currentSupply;
                balance.proportionOfCurrentSupply = Math.round(((parseInt(balanceDatum.balance) / parseInt(asset.currentSupply.toString())) * 100));
            }

            // If asset does not exist in store
            if (!assetsMap[assetID]) {
                // Try Ortelius
                api.get(`/x/assets/${assetID}`).then(res => {
                    if (res.data) {
                        console.log("FOUND ASSET IN ORTELIUS", res.data);
                        let asset: IAssetData_Ortelius = res.data;
                        
                        this.setAssetMetadata(asset, balance);
                        this.setBalanceData(balanceDatum, balance.denomination, balance);                        
                        balance.currentSupply = stringToBig(asset.currentSupply, balance.denomination);
                        balance.proportionOfCurrentSupply = Math.round(((parseInt(balanceDatum.balance) / parseInt("0")) * 100));

                    } else if (!res.data) {
                        // Try Avalanche-Go as last resort
                        avm.getAssetDescription(assetID).then((res: IAssetData_Avalanche_Go) => {
                            if (res) {        
                                console.log("FOUND ASSET IN GECKO", res);
                                let asset = res;
                                
                                this.setAssetMetadata(asset, balance);
                                this.setBalanceData(balanceDatum, balance.denomination, balance);
                                balance.currentSupply = stringToBig("0", balance.denomination);                              
                                balance.proportionOfCurrentSupply = Math.round(((parseInt(balanceDatum.balance) / parseInt("0")) * 100));

                            }
                        });
                    }
                });
                
            }
            
            balances.push(balance);
            
            // update balances metadata
            this.totalTransactionCount += balance.transactionCount;
            this.totalUtxoCount += balance.utxoCount;            
        }

        return balances;
    }
    
    // set asset metadata for convenience
    private setAssetMetadata(asset: Asset | IAssetData_Ortelius | IAssetData_Avalanche_Go, balance: IBalance) {
        balance.name = asset.name;
        balance.denomination = asset.denomination;
        balance.symbol = asset.symbol;
    }
    
    // set balance data (relies on asset metadata) 
    private setBalanceData(balanceDatum: IBalanceDatum, denomination: number, balance: IBalance) {
        balance.balance = stringToBig(balanceDatum.balance, denomination);
        balance.totalReceived = stringToBig(balanceDatum.totalReceived, denomination);
        balance.totalSent = stringToBig(balanceDatum.totalSent, denomination);
    }

    private setAVAXBalance(): void {
        let result = this.assets.find(asset => asset.id === AVAX_ID);
        if (result) {
            this.avaxBalance = result.balance;
        }
    }
}
