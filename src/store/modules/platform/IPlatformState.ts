import Subnet from '@/js/Subnet';
import Blockchain from '@/js/Blockchain';

export interface IPlatformState {
    subnets: Subnets
    blockchains: Blockchain[],
    subnetsLoaded: boolean
}

export interface Subnets {
    [key: string]: Subnet
}