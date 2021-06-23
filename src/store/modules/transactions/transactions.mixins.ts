import { Vue, Component } from 'vue-property-decorator'
import {
    getTx,
    getTxs,
    getRecentTxs,
    getTxsByAsset,
    getTxsByAddress,
    getTxsByBlockchain,
    getEVMTx,
} from './transactions.getters'

@Component
export class TransactionsGettersMixin extends Vue {
    getTx() {
        return getTx()
    }

    getTxs() {
        return getTxs()
    }

    getRecentTxs() {
        return getRecentTxs()
    }

    getTxsByAddress() {
        return getTxsByAddress()
    }

    getTxsByAsset() {
        return getTxsByAsset()
    }

    getTxsByBlockchain() {
        return getTxsByBlockchain()
    }

    getEVMTx() {
        return getEVMTx()
    }
}
