import Subnet from '@/js/Subnet';

export interface IPlatformState {
    subnets: {
        [key: string]: Subnet
    }
}

