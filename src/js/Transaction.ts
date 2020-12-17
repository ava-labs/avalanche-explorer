import {
    ITransaction,
    ITransactionData,
    ITransactionInputData,
    ITransactionInput,
    ITransactionOutput,
    ITransactionOutputData,
} from '@/js/ITransaction'
import { stringToBig } from '@/helper'

function getOutput(output: ITransactionOutputData): ITransactionOutput {
    return {
        addresses: output.addresses,
        amount: stringToBig(output.amount), // TODO: this Big conversion is not denominated bc of dependency on asset lookup
        assetID: output.assetID,
        id: output.id,
        locktime: output.locktime,
        outputIndex: output.outputIndex,
        outputType: output.outputType,
        redeemingTransactionID: output.redeemingTransactionID,
        threshold: output.threshold,
        timestamp: new Date(output.timestamp),
        transactionID: output.transactionID,
    }
}

export const txTypeMap = new Map<string, string>([
    ['add_delegator', 'Add Delegator'],
    ['add_subnet_validator', 'Add Subnet Validator'],
    ['base', 'Base'],
    ['create_asset', 'Create Asset'],
    ['create_subnet', 'Create Subnet'],
    ['export', 'Export'],
    ['pvm_export', 'PVM Export'],
    ['pvm_import', 'PVM Import'],
])

export function getMappingForType(type: string) {
    return txTypeMap.get(type) || 'No type provided'
}

export class Transaction implements ITransaction {
    id: string
    inputs: ITransactionInput[]
    outputs: ITransactionOutput[]
    timestamp: string
    type: string
    chainID: string
    memo: string

    constructor(data: ITransactionData) {
        this.inputs =
            data.inputs === null || data.inputs.length === 0
                ? []
                : data.inputs.map((input: ITransactionInputData) => {
                      return {
                          credentials: input.credentials,
                          output: getOutput(input.output),
                      }
                  })
        this.outputs =
            data.outputs === null || data.outputs.length === 0
                ? []
                : data.outputs.map((output: ITransactionOutputData) =>
                      getOutput(output)
                  )
        this.id = data.id
        this.timestamp = data.timestamp
        this.type = data.type
        this.chainID = data.chainID
        this.id = data.id
        this.memo = data.memo
    }

    getInputAddresses(): string[] {
        const res: string[] = []
        const inputs = this.inputs || []

        inputs.forEach((input) => {
            res.push(...input.output.addresses)
        })

        return res
    }
}
