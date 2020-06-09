import gecko_api from "@/gecko_api";
import { ISubnetData } from "@/store/modules/platform/ISubnet"
import { IBlockchain, IBlockchainData } from '@/store/modules/platform/IBlockchain';
import { IValidator, IValidatorData } from "@/store/modules/platform/IValidator";
import { AVA_SUBNET_ID } from '@/store/modules/platform/platform';

export default class Subnet {
    id: string;
    controlKeys: string[];
    threshold: number;
    blockchains: IBlockchain[];
    validators: IValidator[];
    pendingValidators: IValidator[];

    constructor(data: ISubnetData) {
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

    async updateValidators() {
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
        let validators = validatorsData.map((v: IValidatorData) => {
            let validator: IValidator = {
                id: v.id,
                startTime: new Date(parseInt(v.startTime)),
                endTime: new Date(parseInt(v.endTime))
            }

            // set optional props for validators of default subnet
            if ({}.hasOwnProperty.call(v, "address") &&
                {}.hasOwnProperty.call(v, "stakeAmount")) {
                validator.address = v.address;
                validator.stakeAmount = parseInt(v.stakeAmount as string);
            }

            // set optional props for validators of other subnet
            if ({}.hasOwnProperty.call(v, "weight")) {
                validator.weight = parseInt(v.weight as string);
            }

            return validator;
        });

        // sort list and set rank prop
        (this.id === AVA_SUBNET_ID) ?
            validators.sort((a, b) => (b.stakeAmount as number) - (a.stakeAmount as number)) :
            validators.sort((a, b) => (b.weight as number) - (a.weight as number));        
        validators.forEach((v, i) => v.rank = i + 1);

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
        let response = await gecko_api.post("", req);
        let pendingValidatorsData = response.data.result.validators as IValidatorData[];
        let pendingValidators = pendingValidatorsData.map((v: IValidatorData) => {
            let validator: IValidator = {
                id: v.id,
                startTime: new Date(parseInt(v.startTime)),
                endTime: new Date(parseInt(v.endTime))
            }

            if ({}.hasOwnProperty.call(v, "address") &&
                {}.hasOwnProperty.call(v, "stakeAmount")) {
                validator.address = v.address;
                validator.stakeAmount = parseInt(v.stakeAmount as string);
            }

            if ({}.hasOwnProperty.call(v, "weight")) {
                validator.weight = parseInt(v.weight as string);
            }

            return validator;
        });

        (this.id === AVA_SUBNET_ID) ? 
            pendingValidators.sort((a, b) => (b.stakeAmount as number) - (a.stakeAmount as number)) :
            pendingValidators.sort((a, b) => (b.weight as number) - (a.weight as number));
        pendingValidators.forEach((v, i) => v.rank = i + 1);

        this.pendingValidators = pendingValidators;
    }
}
