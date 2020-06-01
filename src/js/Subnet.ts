import { ISubnetData } from "@/store/modules/platform/ISubnet"
import { IBlockchain, IBlockchainData } from '@/store/modules/platform/IBlockchain';
import gecko_api from "@/gecko_api";
import { IValidator, IValidatorData } from "@/store/modules/platform/IValidator";

export default class Subnet {
    id: string;
    controlKeys: string[];
    threshold: number;
    blockchains: IBlockchain[];
    validators: IValidator[];
    pendingValidators: IValidator[];
    
    constructor(data: ISubnetData) {
        console.log(data);
        this.id = data.id;
        this.controlKeys = data.controlKeys;
        this.threshold = parseInt(data.threshold);
        this.blockchains = [];
        this.validators = [];
        this.pendingValidators = [];
    }

    addBlockchain(data: IBlockchainData) {
        this.blockchains.push(data);
    }

    async updateCurrentValidators() {
        let req = {
            "jsonrpc": "2.0",
            "method": "platform.getCurrentValidators",
            "params": {
                subnetID: this.id
            },
            "id": 1
        };
        let response = await gecko_api.post("", req);
        let validatorsData = response.data.result.validators as IValidatorData[];
        let validators = validatorsData.map((val: IValidatorData) => ({
            id: val.id,
            stakeAmount: parseInt(val.stakeAmount),
            startTime: new Date(parseInt(val.startTime) * 1000),
            endTime: new Date(parseInt(val.endTime) * 1000)
        }));

        console.log(validators);
        // validators.sort((a,b) => {
        //     return b.stakeAmount - a.stakeAmount;
        // });
        this.validators = validators;
    }
    
    async updatePendingValidators() {
        let req = {
            "jsonrpc": "2.0",
            "method": "platform.getPendingValidators",
            "params": {
                subnetID: this.id
            },
            "id": 1
        };
        let response = await gecko_api.post("", req) as IValidatorData[];
        let pendingValidatorsData = response.data.result.validators as IValidatorData[];

        this.pendingValidators = pendingValidatorsData.map((val: IValidatorData) => ({
            id: val.id,
            stakeAmount: parseInt(val.stakeAmount),
            startTime: new Date(parseInt(val.startTime) * 1000),
            endTime: new Date(parseInt(val.endTime) * 1000)
        }));
    }
}

