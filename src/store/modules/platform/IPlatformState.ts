import Subnet from '@/js/Subnet';
import Blockchain from '@/js/Blockchain';

export interface IPlatformState {
    subnets: {
        [key: string]: Subnet
    },
    blockchains: {
        [key: string]: Blockchain
    },
    subnetsLoaded: boolean
}
