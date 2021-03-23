export interface IAggregateRes {
    aggregates: IAggregate
    intervalSize: number
    intervals: IAggregate[]
    startTime: string
    endTime: string
}

export interface IAggregate {
    startTime: string
    endTime: string
    transactionVolume: string
    transactionCount: number
    addressCount: number
    outputCount: number
    assetCount: number
}

export interface IAssetAggregate {
    asset: string
    aggregate: {
        aggregates: IAggregate
        startTime: string
        endTime: string
    }
}
