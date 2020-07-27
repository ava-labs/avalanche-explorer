export interface IValidator {
    id: string                  // validator node id
    startTime: Date
    endTime: Date
    address?: string            // default subnet only. payout address (not the address who staked) 
    stakeAmount?: number        // default subnet only
    totalStakeAmount?: number   // default subnet only. sum of validator and delegator stake amounts
    delegators?: IValidator[]   // default subnet only. a validator contains delegators if they have the same node id
    weight?: number             // non-default subnet only. analogous to stakeAmount
    rank?: number               // based on stake or weight
    elapsed?: number          // how much time has elasped during staking period (%)
}

export interface IStakingData {
    id: string
    startTime: string
    endTime: string
    address?: string
    stakeAmount?: string
    weight?: string
}
