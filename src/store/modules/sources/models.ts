import {
    EventSignature,
    FunctionSignature,
    DecodedContractResponse,
} from '@/services/sources/models'

export interface SourcesState {
    abisLoaded: boolean
    abis: any | null
    abiDecoder: any
    signatures: FunctionSignature[]
    eventSignatures: EventSignature[]
    verifiedContracts: DecodedContractMap
}

export interface DecodedContractMap {
    [key: string]: DecodedContractResponse
}

export interface DecodedFunction {
    name: string
    params: DecodedParam[]
}

export interface DecodedParam {
    name: string
    type: string
    value: string
}
