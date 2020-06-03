import { ISubnetData } from "@/store/modules/platform/ISubnet"
import { IBlockchain, IBlockchainData } from '@/store/modules/platform/IBlockchain';
import gecko_api from "@/gecko_api";
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
        console.log("Subnet ID      ", this.id);
        console.log("validatorsData ", validatorsData);
        let validators = validatorsData.map((v: IValidatorData) => {
            let validator: IValidator = {
                id: v.id,
                startTime: new Date(parseInt(v.startTime) * 1000),
                endTime: new Date(parseInt(v.endTime) * 1000)
            }

            // set optional props for validators of default subnet
            if ({}.hasOwnProperty.call(v, "address") &&
                {}.hasOwnProperty.call(v, "stakeAmount")) {
                validator.address = v.address;
                validator.stakeAmount = parseInt(v.stakeAmount as string);
                console.log("stake:", validator.stakeAmount);
            }

            // set optional props for validators of other subnet
            if ({}.hasOwnProperty.call(v, "weight")) {
                validator.weight = parseInt(v.weight as string);
                console.log("weight:", validator.weight);
            }

            return validator;
        });

        if (this.id === AVA_SUBNET_ID) {
            validators.sort((a, b) => {
                return (b.stakeAmount as number) - (a.stakeAmount as number);
            });
        } else {
            validators.sort((a, b) => (b.weight as number) - (a.weight as number));
        }

        this.validators = validators;
        
        if (this.id === AVA_SUBNET_ID) {
            console.log(this.validators);
            this.validators.forEach(v => console.log("stake?", v.stakeAmount));
        } else {
            console.log(this.validators);
            this.validators.forEach(v => console.log("weight?", v.weight));
        }
        
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
                startTime: new Date(parseInt(v.startTime) * 1000),
                endTime: new Date(parseInt(v.endTime) * 1000)
            }

            if ({}.hasOwnProperty.call(v, "address") &&
                {}.hasOwnProperty.call(v, "stakeAmount")) {
                validator.address = v.address;
                validator.stakeAmount = parseInt(v.stakeAmount as string);
                console.log("stake:", validator.stakeAmount);
            }

            if ({}.hasOwnProperty.call(v, "weight")) {
                validator.weight = parseInt(v.weight as string);
                console.log("weight:", validator.weight);
            }

            return validator;
        });

        if (this.id === AVA_SUBNET_ID) {
            pendingValidators.sort((a, b) => {
                return (b.stakeAmount as number) - (a.stakeAmount as number);
            });
        } else {
            pendingValidators.sort((a, b) => (b.weight as number) - (a.weight as number));
        }

        this.pendingValidators = pendingValidators;
    }
}

