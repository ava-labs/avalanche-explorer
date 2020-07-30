import gecko_api from "@/gecko_api";
import { ISubnetData } from "@/store/modules/platform/ISubnet"
import Blockchain from '@/js/Blockchain';
import { IValidator, IStakingData } from "@/store/modules/platform/IValidator";
import { AVALANCHE_SUBNET_ID } from '@/store/modules/platform/platform';

export default class Subnet {
    id: string;
    controlKeys: string[];
    threshold: number;
    blockchains: Blockchain[];
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

    // TODO: get address details for Platform Keys (https://docs.avax.network/v1.0/en/api/platform/#platformgetaccount)

    async updateValidators(endpoint: string) {
        // Get validators from service
        let req = {
            "jsonrpc": "2.0",
            "method": endpoint,
            "params": {
                subnetID: this.id
            },
            "id": 1
        };
        let response = await gecko_api.post("", req);
        let validatorsData = response.data.result.validators as IStakingData[];
        let validators: IValidator[] = []; 
        
        if (validatorsData.length > 0) {
            validators = this.cast(validatorsData);
            if (this.id === AVALANCHE_SUBNET_ID) {
                validators = this.sortForDelegators(validators);
                validators = this.nestValidatorsAndDelegators(validators);
            }
            validators = this.sortByStake(validators, this.id);
        }

        if (endpoint === "platform.getCurrentValidators") {
            this.validators = validators;
        } else if (endpoint === "platform.getPendingValidators") {
            this.pendingValidators = validators;
        }
    }

    addBlockchain(data: Blockchain) {
        this.blockchains.push(data);
    }

    /*
     * Convert staking data from API into validator objects
     */
    private cast(stakingData: IStakingData[]): IValidator[] {
        let validators = stakingData.map((s: IStakingData) => {
            let validator: IValidator = {
                id: s.id,
                startTime: new Date(parseInt(s.startTime) * 1000),
                endTime: new Date(parseInt(s.endTime) * 1000)
            }

            // set optional props for validators of default subnet
            if ({}.hasOwnProperty.call(s, "address") &&
                {}.hasOwnProperty.call(s, "stakeAmount")) {
                validator.address = s.address;
                validator.stakeAmount = parseInt(s.stakeAmount as string);
                validator.totalStakeAmount = validator.stakeAmount;
                validator.delegators = [];
                validator.elapsed = this.getElapsedStakingPeriod(validator);
            }

            // set optional props for validators of non-default subnet
            if ({}.hasOwnProperty.call(s, "weight")) {
                validator.weight = parseInt(s.weight as string);
            }

            return validator;
        });
        return validators;
    }
    
    /** 
     *  Sort validators to find delegators 
     *  Validator                   = 'address A' stakes via 'id X' with 'earliest startTime'
     *  Delegation by Validator     = 'address A' stakes via 'id X' with 'later startTime'
     *  Delegation by Other         = 'address B' stakes via 'id X' with 'later startTime'
     */
    private sortForDelegators(validators: IValidator[]): IValidator[] {
        return validators.sort((a, b) => {
            // primary sort by id
            if (a.id < b.id) {
                return -1;
            } else if (a.id > b.id) {
                return 1;
            }
            // secondary sort by startTime
            if (a.startTime.getTime() < b.startTime.getTime()) {
                return -1;
            } else if (a.startTime.getTime() < b.startTime.getTime()) {
                return 1;
            }
            return 0
        });
    }

    /** 
     *  Create set of unique validators
     *  Delegation stakes are nested inside validators
     */
    private nestValidatorsAndDelegators(sorted: IValidator[]): IValidator[] {
        let validatorsMap: {[key:string]: IValidator} = {};
        for (let i = 0; i < sorted.length; i++) {
            let nodeID = sorted[i].id;
            if (validatorsMap[nodeID]) {
                // add delegator
                // eslint-disable-next-line
                validatorsMap[nodeID].delegators!.push(sorted[i]);
            } else {
                // add validator
                validatorsMap[nodeID] = sorted[i];
            }
        }
        let nestedValidators: IValidator[] = Object.values(validatorsMap);
        
        // calculate totalStakeAmount
        nestedValidators.forEach((v => {
            if (v.delegators) {
                if (v.delegators.length > 0) {
                    let delegatedStake = 0;
                    // eslint-disable-next-line
                    v.delegators.forEach(v => delegatedStake += v.stakeAmount!);
                    // eslint-disable-next-line
                    v.totalStakeAmount! += delegatedStake;
                }
                return [];
            }
        }));
        return nestedValidators;
    }
    
    /** 
     *  Sort by stake or weight and add rank
     */
    private sortByStake(validators: IValidator[], id: string): IValidator[] {
        (id === AVALANCHE_SUBNET_ID) ?
            validators.sort((a, b) => (b.totalStakeAmount as number) - (a.totalStakeAmount as number)) :
            validators.sort((a, b) => (b.weight as number) - (a.weight as number));
        validators.forEach((v, i) => v.rank = i + 1);
        return validators;
    }

    /** 
     *  Elapsed staking period (%)
     */
    private getElapsedStakingPeriod(validator:IValidator): number {
        let currentTime = new Date().getTime();
        let numerator = currentTime - validator.startTime.getTime();
        let denominator = validator.endTime.getTime() - validator.startTime.getTime();
        return Math.round((numerator / denominator) * 100);
    }
}
