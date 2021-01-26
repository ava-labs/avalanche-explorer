import { IAddress } from '@/services/addresses/models'

export interface IAddressState {
    addresses: {
        [key: string]: IAddress
    }
    addressesList: IAddress[]
    addressesLoaded: boolean
}
