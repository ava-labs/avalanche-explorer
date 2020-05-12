

export interface PlatformState {
    validators: Validator[]
    validatorsPending: APIValidator[]
}


export interface Validator {
    endTime: Date
    id: string
    stakeAmount: number
    startTime: Date
}


export interface APIValidator{
    endtime: string
    id: string
    stakeAmount: string
    startTime: string
}
