import { Transaction } from '@/js/Transaction'
import { TransactionQueryResponse } from '..'
import { TransactionQuery, TransactionResponse } from '../models'

export function parseTxs(txRes: TransactionQueryResponse): TransactionQuery {
    return {
        ...txRes,
        transactions: txRes.transactions.map((tx: TransactionResponse) => {
            return new Transaction(tx)
        }),
    }
}
