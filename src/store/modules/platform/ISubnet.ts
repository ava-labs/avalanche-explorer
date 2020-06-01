import { IBlockchain } from './IBlockchain';

export interface ISubnetData {
    id: string,
    controlKeys: string[],
    threshold: string,
}

export interface ISubnet {
    id: string,
    controlKeys: string[],
    threshold: number,
    blockchains: IBlockchain[]
}
