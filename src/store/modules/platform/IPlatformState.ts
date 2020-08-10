import Subnet from '@/js/Subnet';
import Blockchain from '@/js/Blockchain';

export interface IPlatformState {
    subnets: ISubnets
    blockchains: Blockchain[],
    subnetsLoaded: boolean
}

export interface ISubnets {
    [key: string]: Subnet
}