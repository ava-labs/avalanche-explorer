import { IValidator } from './IValidator';

export interface IBlockchainData {
    id: string,
    name: string,
    subnetID: string,
    vmID: string
}

export interface IBlockchain {
    id: string,
    name: string,
    subnetID: string,
    vmID: string,
    status?: string | undefined,
    validators?: IValidator[] | undefined,
    pendingValidators?: IValidator[] | undefined
}