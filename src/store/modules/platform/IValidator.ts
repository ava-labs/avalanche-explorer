export interface IValidator {
    id: string
    startTime: Date
    endTime: Date
    address?: string            // applies to default subnet 
    stakeAmount?: number        // applies to default subnet 
    weight?: number             // applies to other subnets. analogous to stakeAmount
    rank?: number               // based on stake or weight
    delegators?: IValidator[]   // validators that contain delegators
}

export interface IStakingData {
    id: string
    startTime: string
    endTime: string
    address?: string
    stakeAmount?: string
    weight?: string
}
