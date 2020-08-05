import { IAddress } from '@/js/IAddress';

export interface IAddressState {
    addresses: {
        [key: string]: IAddress
    },
    addressesList: IAddress[],
    addressesLoaded: boolean
}
