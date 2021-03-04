import {
    ITransaction,
    TransactionResponse,
    InputResponse,
    Input,
    Output,
    OutputResponse,
    InputTotal,
    OutputTotal,
} from '@/store/modules/transactions/models'
import { stringToBig } from '@/helper'
import { txTypeMap, txChainTypeMap } from '@/store/modules/transactions/maps'

function getOutput(output: OutputResponse): Output {
    return {
        id: output.id,
        transactionID: output.transactionID,
        redeemingTransactionID: output.redeemingTransactionID,
        outputIndex: output.outputIndex,
        chainID: output.chainID,
        assetID: output.assetID,
        timestamp: new Date(output.timestamp),
        amount: stringToBig(output.amount), // TODO: this Big conversion is not denominated bc of dependency on asset lookup

        outputType: output.outputType,
        groupID: output.groupID,

        // RELEVANT TO P-CHAIN
        stake: output.stake,
        frozen: output.frozen,
        stakeableout: output.stakeableout,
        genesisutxo: output.genesisutxo,

        // RELEVANT TO X-CHAIN
        locktime: output.locktime,
        stakeLocktime: output.stakeLocktime,
        threshold: output.threshold,
        payload: output.payload,

        // RELEVANT TO P-CHAIN & X-CHAIN
        addresses: output.addresses,

        // RELEVANT TO C-CHAIN
        caddresses: output.caddresses,
        block: output.block,
        nonce: output.nonce,
    }
}

export function getMappingForType(type: string) {
    return txTypeMap.get(type) || 'Unknown'
}

export function getTransactionChainType(chainID: string) {
    return txChainTypeMap.get(chainID)
}

export function getTransactionOutputs(outputs: Output[], chainID: string) {
    return outputs.map((output) => {
        const chainType = getTransactionChainType(chainID)
        const addresses =
            output.addresses !== null ? output.addresses : output.caddresses
        const prefix = output.addresses !== null ? `${chainType?.code}-` : ``
        return {
            ...output,
            addresses: addresses.map(
                (address) =>
                    ({
                        address,
                        displayAddress: `${prefix}${address}`,
                    } as DisplayAddress)
            ),
        }
    })
}

export function getTransactionInputs(inputs: Input[], chainId: string) {
    return inputs.map((input) => ({
        credentials: input.credentials,
        output: getTransactionOutputs([input.output], chainId)[0],
    }))
}

export interface DisplayAddress {
    address: string
    displayAddress: string
}

export class Transaction implements ITransaction {
    id: string
    chainID: string
    type: string
    inputs: Input[]
    outputs: Output[]
    memo: string
    inputTotals: InputTotal
    outputTotals: OutputTotal
    reusedAddressTotals: string | null
    timestamp: string
    txFee: number
    genesis: boolean
    rewarded: boolean
    rewardedTime: string | null
    epoch: number
    vertexId: string
    validatorNodeID: string
    validatorStart: number
    validatorEnd: number
    txBlockId: string

    constructor(data: TransactionResponse) {
        this.id = data.id
        this.chainID = data.chainID
        this.type = data.type
        this.inputs =
            data.inputs === null || data.inputs.length === 0
                ? []
                : data.inputs.map((input: InputResponse) => {
                      return {
                          credentials: input.credentials,
                          output: getOutput(input.output),
                      }
                  })
        this.outputs =
            data.outputs === null || data.outputs.length === 0
                ? []
                : data.outputs.map((output: OutputResponse) =>
                      getOutput(output)
                  )
        this.memo = data.memo
        this.inputTotals = data.inputTotals
        this.outputTotals = data.outputTotals
        this.reusedAddressTotals = data.reusedAddressTotals
        this.timestamp = data.timestamp
        this.txFee = data.txFee
        this.genesis = data.genesis
        this.rewarded = data.rewarded
        this.rewardedTime = data.rewardedTime
        this.epoch = data.epoch
        this.vertexId = data.vertexId
        this.validatorNodeID = data.validatorNodeID
        this.validatorStart = data.validatorStart
        this.validatorEnd = data.validatorEnd
        this.txBlockId = data.txBlockId
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
