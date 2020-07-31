import Subnet from '@/js/Subnet';
import Blockchain from '@/js/Blockchain';

export interface IPlatformState {
    subnets: {
        [key: string]: Subnet
    },
    blockchains: Blockchain[],
    subnetsLoaded: boolean
}
