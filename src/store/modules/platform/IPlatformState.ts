import Subnet from '@/js/Subnet'
import Blockchain from '@/js/Blockchain'
import Big from 'big.js'
import { BN } from 'avalanche'

export interface IPlatformState {
    subnets: ISubnets
    blockchains: Blockchain[]
    subnetsLoaded: boolean
    minStake: BN
    currentSupply: BN
}

export interface ISubnets {
    [key: string]: Subnet
}
