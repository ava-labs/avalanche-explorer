import avalanche_go_api from '@/avalanche_go_api'
import { ISubnetData } from '@/store/modules/platform/ISubnet'
import Blockchain from '@/js/Blockchain'
import {
    IValidator,
    IValidatorData,
    IDelegator,
    IDelegatorData,
    IPendingValidatorData,
    IPendingValidator,
    IPendingDelegator,
    IPendingDelegatorData,
} from '@/store/modules/platform/IValidator'
import { AVALANCHE_SUBNET_ID } from '@/store/modules/platform/platform'

export default class Subnet {
    id: string
    controlKeys: string[]
    threshold: number
    blockchains: Blockchain[]
    validators: IValidator[]
    delegators: IDelegator[]
    pendingValidators: IPendingValidator[]
    pendingDelegators: IPendingDelegator[]

    constructor(data: ISubnetData) {
        this.id = data.id
        this.controlKeys = data.controlKeys
        this.threshold = parseInt(data.threshold)
        this.blockchains = []
        this.validators = []
        this.pendingValidators = []
        this.delegators = []
        this.pendingDelegators = []
    }

    // TODO: get address details for Platform Keys (https://docs.avax.network/v1.0/en/api/platform/#platformgetaccount)

    async updateValidators(endpoint: string) {
        /* ==========================================
            GET DATA FROM SERVICE
           ========================================== */
        const req = {
            jsonrpc: '2.0',
            method: endpoint,
            params: {
                subnetID: this.id,
            },
            id: 1,
        }
        const response = await avalanche_go_api.post('', req)

        // console.log(`------------- ${this.id.substring(0,4)} ------------ ${endpoint}`);
        // console.log("result:                        ", response.data.result);

        /* ==========================================
            CURRENT VALIDATORS
           ========================================== */
        if (endpoint === 'platform.getCurrentValidators') {
            const validatorsData = response.data.result
                .validators as IValidatorData[]
            let validators: IValidator[] = []
            let delegators: IDelegator[] = []

            if (validatorsData.length > 0) {
                // All Subnets
                validators = this.setValidators(validatorsData)
                validators = this.sortByStake(validators, this.id)

                // Primary Network Only
                if (this.id === AVALANCHE_SUBNET_ID) {
                    validators.forEach((v: IValidator) => {
                        if (v.delegators !== null) {
                            v.delegators?.forEach((d: IDelegator) =>
                                delegators.push(d)
                            )
                        }
                    })
                }
                delegators = this.sortDelegators(delegators)
            }

            this.validators = validators
            this.delegators = delegators
        } else if (endpoint === 'platform.getPendingValidators') {
            /* ==========================================
            PENDING VALIDATORS
           ========================================== */
            const pendingValidatorsData = response.data.result
                .validators as IPendingValidatorData[]
            let pendingValidators: IPendingValidator[] = []
            let pendingDelegators: IPendingDelegator[] = []

            // All Subnets
            if (pendingValidatorsData.length > 0) {
                pendingValidators = this.setPendingValidators(
                    pendingValidatorsData
                )
            }

            // Primary Network Only
            if (this.id === AVALANCHE_SUBNET_ID) {
                const pendingDelegatorsData = response.data.result
                    .delegators as IPendingValidatorData[]
                if (pendingDelegatorsData.length > 0) {
                    pendingDelegators = this.setPendingDelegators(
                        pendingDelegatorsData
                    )
                }
            }

            this.pendingValidators = pendingValidators
            this.pendingDelegators = pendingDelegators
        }
    }

    addBlockchain(data: Blockchain) {
        this.blockchains.push(data)
    }

    /**
     * Convert API data to validators
     */
    private setValidators(validatorsData: IValidatorData[]): IValidator[] {
        const validators = validatorsData.map((v: IValidatorData) => {
            const validator: IValidator = {
                nodeID: v.nodeID,
                startTime: new Date(parseInt(v.startTime) * 1000),
                endTime: new Date(parseInt(v.endTime) * 1000),
            }

            // Primary Network
            if ({}.hasOwnProperty.call(v, 'stakeAmount')) {
                validator.rewardOwner = {
                    locktime: parseInt(v.rewardOwner!.locktime),
                    threshold: parseInt(v.rewardOwner!.threshold),
                    addresses: v.rewardOwner!.addresses,
                }
                validator.potentialReward = parseInt(
                    v.potentialReward as string
                )
                validator.stakeAmount = parseInt(v.stakeAmount as string)
                validator.uptime = parseFloat(v.uptime as string) * 100 // percentage
                validator.connected = v.connected
                validator.delegationFee = parseInt(v.delegationFee as string)
                validator.delegators = this.setDelegators(v.delegators!) as
                    | IDelegator[]
                    | null
                validator.totalStakeAmount = this.calculateTotalStakeAmount(
                    validator.delegators,
                    validator.stakeAmount
                )
                validator.elapsed = this.getElapsedStakingPeriod(validator)
            }
            // Subnets
            if ({}.hasOwnProperty.call(v, 'weight')) {
                validator.weight = parseInt(v.weight as string)
            }
            return validator
        })
        return validators
    }

    /**
     * Convert API data to delegators
     */
    private setDelegators(
        delegatorsData: IDelegatorData[] | null
    ): IDelegator[] | null {
        let delegators = null

        if (delegatorsData) {
            delegators = delegatorsData.map((d) => {
                const delegator: IDelegator = {
                    nodeID: d.nodeID,
                    startTime: new Date(parseInt(d.startTime) * 1000),
                    endTime: new Date(parseInt(d.endTime) * 1000),
                    rewardOwner: {
                        locktime: parseInt(d.rewardOwner.locktime),
                        threshold: parseInt(d.rewardOwner.threshold),
                        addresses: d.rewardOwner.addresses,
                    },
                    potentialReward: parseInt(d.potentialReward),
                    stakeAmount: parseInt(d.stakeAmount),
                }
                return delegator
            })
        }
        return delegators
    }

    /**
     * Convert API data to pending validators
     */
    private setPendingValidators(
        pendingValidatorsData: IPendingValidatorData[]
    ): IPendingValidator[] {
        const pendingValidators = pendingValidatorsData.map(
            (pv: IPendingValidatorData) => {
                const pendingValidator: IPendingValidator = {
                    nodeID: pv.nodeID,
                    startTime: new Date(parseInt(pv.startTime) * 1000),
                    endTime: new Date(parseInt(pv.endTime) * 1000),
                    stakeAmount: parseInt(pv.stakeAmount),
                    delegators: null,
                }

                // Pending Validators - set optional props
                if ({}.hasOwnProperty.call(pv, 'connected')) {
                    pendingValidator.connected = pv.connected as boolean
                    pendingValidator.delegationFee = parseInt(
                        pv.delegationFee as string
                    )
                }

                return pendingValidator
            }
        )
        return pendingValidators
    }

    /**
     * Convert API data to pending delegators
     */
    private setPendingDelegators(
        pendingDelegatorsData: IPendingDelegatorData[] | null
    ): IPendingDelegator[] {
        let pendingDelegators: IPendingDelegator[] = []

        if (pendingDelegatorsData) {
            pendingDelegators = pendingDelegatorsData.map((pd) => {
                const pendingDelegator: IPendingDelegator = {
                    nodeID: pd.nodeID,
                    startTime: new Date(parseInt(pd.startTime) * 1000),
                    endTime: new Date(parseInt(pd.endTime) * 1000),
                    stakeAmount: parseInt(pd.stakeAmount),
                }
                return pendingDelegator
            })
        }
        return pendingDelegators
    }

    /**
     *  validated + delegated stake
     */
    private calculateTotalStakeAmount(
        delegators: IDelegator[] | null,
        stakeAmount: number
    ): number {
        let totalStakeAmount = stakeAmount

        if (delegators) {
            let delegatedStakeAmount = 0
            delegators.forEach((d) => (delegatedStakeAmount += d.stakeAmount))
            totalStakeAmount += delegatedStakeAmount
        }

        return totalStakeAmount
    }

    /**
     *  Sort by stake or weight and add rank
     */
    private sortByStake(validators: IValidator[], id: string): IValidator[] {
        id === AVALANCHE_SUBNET_ID
            ? validators.sort(
                  (a, b) =>
                      (b.totalStakeAmount as number) -
                      (a.totalStakeAmount as number)
              )
            : validators.sort(
                  (a, b) => (b.weight as number) - (a.weight as number)
              )
        validators.forEach((v, i) => (v.rank = i + 1))
        return validators
    }

    /**
     *  Sort by stake
     */
    private sortDelegators(delegators: IDelegator[]): IDelegator[] {
        return delegators.length > 0
            ? delegators.sort((a, b) => b.stakeAmount - a.stakeAmount)
            : []
    }

    /**
     *  Elapsed staking period (%)
     */
    private getElapsedStakingPeriod(validator: IValidator): number {
        const currentTime = new Date().getTime()
        const numerator = currentTime - validator.startTime.getTime()
        const denominator =
            validator.endTime.getTime() - validator.startTime.getTime()
        return Math.round((numerator / denominator) * 100)
    }
}
