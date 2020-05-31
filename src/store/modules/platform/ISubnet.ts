import { IBlockchain } from './IBlockchain';

export interface ISubnet {
    id: string,
    blockchains: IBlockchain[]
}
