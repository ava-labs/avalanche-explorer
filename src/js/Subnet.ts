import avalanche_go_api from "@/avalanche_go_api";
import { ISubnetData } from "@/store/modules/platform/ISubnet"
import Blockchain from '@/js/Blockchain';
import { IValidator, IStakingData, IValidatorData, IDelegatorData, IPendingValidatorData, IValidator_New, IDelegator_New, IPendingValidator_New } from "@/store/modules/platform/IValidator";
import { AVALANCHE_SUBNET_ID } from '@/store/modules/platform/platform';

export default class Subnet {
    id: string;
    controlKeys: string[];
    threshold: number;
    blockchains: Blockchain[];
    validators: IValidator[];
    pendingValidators: IValidator[];
    delegations: IValidator[];
    pendingDelegations: IValidator[];

    validators_New: IValidator_New[];
    delegations_New: IDelegator_New[]; 
    pendingValidators_New: IPendingValidator_New[];
    pendingDelegations_New: IPendingValidator_New[];


    constructor(data: ISubnetData) {
        this.id = data.id;
        this.controlKeys = data.controlKeys;
        this.threshold = parseInt(data.threshold);
        this.blockchains = [];
        this.validators = [];
        this.pendingValidators = [];
        this.delegations = [];
        this.pendingDelegations = [];
        
        this.validators_New = []
        this.pendingValidators_New = [];
        this.delegations_New = [];
        this.pendingDelegations_New = [];
    }

    // TODO: get address details for Platform Keys (https://docs.avax.network/v1.0/en/api/platform/#platformgetaccount)

    async updateValidators(endpoint: string) {
        /* ==========================================
            GET DATA FROM SERVICE
           ========================================== */
        let req = {
            "jsonrpc": "2.0",
            "method": endpoint,
            "params": {
                subnetID: this.id
            },
            "id": 1
        };
        let response = await avalanche_go_api.post("", req);

        console.log(`------------- ${this.id.substring(0,4)} ------------ ${endpoint}`);
        // console.log("result:                        ", response.data.result);

        /* ==========================================
            CURRENT
           ========================================== */
        if (endpoint === "platform.getCurrentValidators") {
            let validatorsData = response.data.result.validators as IValidatorData[];
            let validators: IValidator_New[] = [];
            console.log(`validatorsData                 `, validatorsData);

            // ALL SUBNETS
            if (validatorsData.length > 0) {
                validators = this.castValidators_New(validatorsData);
            }
            
            // PRIMARY NETWORK ONLY
            if (this.id === AVALANCHE_SUBNET_ID) {
                let delegatorsData = response.data.result.delegators as IDelegatorData[];
                let delegations: IDelegator_New[] = [];
                console.log(`delegatorsData                 `, delegatorsData);
                
                if (delegatorsData.length > 0) {                    
                    delegations = this.castDelegators_New(delegatorsData);
                    // [validators, delegations] = this.nestValidatorsAndDelegators(validators, endpoint);
                }
                this.delegations_New = delegations;
            }
            
            // validators = this.sortByStake(validators, this.id);
            this.validators_New = validators;
        } 
        /* ==========================================
            PENDING
           ========================================== */
        else if (endpoint === "platform.getPendingValidators") {
            let pendingValidatorsData = response.data.result.validators as IPendingValidatorData[];
            let pendingValidators: IPendingValidator_New[] = [];
            console.log(`pendingValidatorsData          `, pendingValidatorsData);
            
            // ALL SUBNETS
            if (pendingValidatorsData.length > 0) {
                pendingValidators = this.castPendingValidators_New(pendingValidatorsData);
            }

            // PRIMARY NETWORK ONLY
            if (this.id === AVALANCHE_SUBNET_ID) {
                let pendingDelegatorsData = response.data.result.delegators as IPendingValidatorData[];
                let pendingDelegations: IPendingValidator_New[] = [];
                console.log(`pendingDelegatorsData          `, pendingDelegatorsData);
                                
                if (pendingDelegatorsData.length > 0) {                    
                    pendingDelegations = this.castPendingValidators_New(pendingDelegatorsData);
                    // [validators, delegations] = this.nestValidatorsAndDelegators(validators, endpoint);                    
                    this.pendingDelegations_New = pendingDelegations;
                }                
                
            }
            
            // validators = this.sortByStake(validators, this.id);
            this.pendingValidators_New = pendingValidators;
        }    
        
        /* ==========================================
            OLD
           ========================================== */

        let validatorsData = response.data.result.validators as IStakingData[];        
        let validators: IValidator[] = []; 
        let delegations: IValidator[] = []; 
        
        if (!validatorsData) {
            return;
        }
        
        if (validatorsData.length > 0) {
            validators = this.cast(validatorsData);
            if (this.id === AVALANCHE_SUBNET_ID) {
                validators = this.sortForDelegators(validators);
                [validators, delegations] = this.nestValidatorsAndDelegators(validators, endpoint);
            }
            validators = this.sortByStake(validators, this.id);
        }

        if (endpoint === "platform.getCurrentValidators") {
            this.validators = validators;
            this.delegations = delegations;
        } else if (endpoint === "platform.getPendingValidators") {
            this.pendingValidators = validators;
            this.pendingDelegations = delegations;
        }
    }

    addBlockchain(data: Blockchain) {
        this.blockchains.push(data);
    }

    /*
     * Convert staking data from API into validator objects
     */
    private castValidators_New(validatorsData: IValidatorData[]): IValidator_New[] {
        let validators = validatorsData.map((v: IValidatorData) => {
            let validator: IValidator_New = {
                nodeID:             v.nodeID,
                startTime:          new Date(parseInt(v.startTime) * 1000),
                endTime:            new Date(parseInt(v.endTime) * 1000),
            };

            // Primary Network validators - set optional props
            if ({}.hasOwnProperty.call(v, "stakeAmount")) {
                validator.rewardOwner = {
                    locktime:                   parseInt(v.rewardOwner!.locktime),
                    threshold:                  parseInt(v.rewardOwner!.threshold),
                    addresses:                  v.rewardOwner!.addresses,
                };
                validator.potentialReward =     parseInt(v.potentialReward as string),
                validator.stakeAmount =         parseInt(v.stakeAmount as string),
                validator.uptime =              parseInt(v.uptime as string), // percentage 
                validator.connected =           v.connected;
                validator.delegationFee =       parseInt(v.delegationFee as string);
            }
            // Non-Primary Network validators - set optional props
            if ({}.hasOwnProperty.call(v, "weight")) {
                validator.weight = parseInt(v.weight as string);
            }
            return validator;
        });
        return validators;
    }

    /*
     * Convert staking data from API into delegator objects
     */
    private castDelegators_New(delegatorsData: IDelegatorData[]): IDelegator_New[] {
        let delegators = delegatorsData.map((d: IDelegatorData) => {
            let delegator: IDelegator_New = {
                nodeID:             d.nodeID,
                startTime:          new Date(parseInt(d.startTime) * 1000),
                endTime:            new Date(parseInt(d.endTime) * 1000),
                rewardOwner: {
                    locktime:       parseInt(d.rewardOwner.locktime),
                    threshold:      parseInt(d.rewardOwner.threshold),
                    addresses:      d.rewardOwner.addresses,
                },
                potentialReward:    parseInt(d.potentialReward),
                stakeAmount:        parseInt(d.stakeAmount),
            }
            return delegator;
        });
        return delegators;
    }

    /*
     * Convert staking data from API into pending validator objects
     */
    private castPendingValidators_New(pendingValidatorsData: IPendingValidatorData[]): IPendingValidator_New[] {
        let pendingValidators = pendingValidatorsData.map((pv: IPendingValidatorData) => {
            let pendingValidator: IPendingValidator_New = {
                nodeID:             pv.nodeID,
                startTime:          new Date(parseInt(pv.startTime) * 1000),
                endTime:            new Date(parseInt(pv.endTime) * 1000),                
                stakeAmount:        parseInt(pv.stakeAmount),
            };

            // Pending Validators - set optional props
            if ({}.hasOwnProperty.call(pv, "connected")) {
                pendingValidator.connected = pv.connected as boolean;
                pendingValidator.delegationFee = parseInt(pv.delegationFee as string);
            }

            return pendingValidator;
        });
        return pendingValidators;
    }
 
    /*
     * Convert staking data from API into validator objects
     */
    private cast(stakingData: IStakingData[]): IValidator[] {
        let validators = stakingData.map((s: IStakingData) => {
            let validator: IValidator = {
                nodeID: s.nodeID,
                startTime: new Date(parseInt(s.startTime) * 1000),
                endTime: new Date(parseInt(s.endTime) * 1000)
            }

            // set optional props for validators of Primary Network
            if ({}.hasOwnProperty.call(s, "stakeAmount")) {
                validator.stakeAmount = parseInt(s.stakeAmount as string);
                validator.totalStakeAmount = validator.stakeAmount;
                validator.elapsed = this.getElapsedStakingPeriod(validator);
                validator.delegators = [];
            }

            // if ({}.hasOwnProperty.call(s, "address")) {
            //     validator.address = s.address;
            // }

            // set optional props for validators of non-Primary Network
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
            if (a.nodeID < b.nodeID) {
                return -1;
            } else if (a.nodeID > b.nodeID) {
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
     *  Create set of delegations
     */
    private nestValidatorsAndDelegators(sorted: IValidator[], endpoint: string): IValidator[][] {
        let validatorsMap: {[key:string]: IValidator} = {};
        let delegations: IValidator[] = [];
        for (let i = 0; i < sorted.length; i++) {
            let nodeID = sorted[i].nodeID;
            if (validatorsMap[nodeID]) {
                // nest delegator within validator
                // eslint-disable-next-line
                validatorsMap[nodeID].delegators!.push(sorted[i]);
                delegations.push(sorted[i]);
            } else {
                // add validator
                validatorsMap[nodeID] = sorted[i];
            }
        }
        let nestedValidators: IValidator[] = Object.values(validatorsMap);
        
        // calculate totalStakeAmount and delegations
        nestedValidators.forEach((v => {
            if (v.delegators) {
                if (v.delegators.length > 0) {
                    let delegatedStake = 0;
                    // eslint-disable-next-line
                    v.delegators.forEach(d => delegatedStake += d.stakeAmount!);
                    // eslint-disable-next-line
                    v.totalStakeAmount! += delegatedStake;
                }
                return [];
            }
        }));

        return [nestedValidators, delegations];
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
