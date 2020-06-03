export interface IValidator {
    id: string
    startTime: Date
    endTime: Date
    address?: string  // applies to default subnet 
    stakeAmount?: number // applies to default subnet 
    weight?: number // applies to other subnets. analogous to stakeAmount
}

export interface IValidatorData{
    id: string
    startTime: string
    endTime: string
    address?: string
    stakeAmount?: string
    weight?: string
}
