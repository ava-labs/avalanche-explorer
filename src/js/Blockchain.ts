import { IBlockchainData } from '@/store/modules/platform/IBlockchain'
import { PCHAINID, XCHAINID, CCHAINID } from '@/known_blockchains'
import { profanities } from '@/js/Profanities'

export default class Blockchain {
    id: string
    name: string
    subnetID: string
    vmID: string
    addressCount?: number | null
    txCount?: number | null
    indexed?: boolean
    profane?: boolean

    constructor(data: IBlockchainData) {
        this.id = data.id
        this.name = data.name
        this.subnetID = data.subnetID
        this.vmID = data.vmID
        this.addressCount = null
        this.txCount = null
        this.indexed = this.updateIndexed()
        this.profane = false
        this.checkForProfanities(this.name)
    }

    private updateIndexed(): boolean {
        switch (this.id) {
            case PCHAINID:
                return true
            case XCHAINID:
                return true
            case CCHAINID:
                return true
            default:
                return false
        }
    }
    private checkForProfanities(value: string): void {
        if (this.profane) {
            return
        }
        this.profane = profanities.screen(value)
    }

    public updateAddressCount(value: string | null): void {
        if (!value) return
        this.addressCount = parseInt(value)
    }

    public updateTxCount(value: string | null): void {
        if (!value) return
        this.txCount = parseInt(value)
    }
}
