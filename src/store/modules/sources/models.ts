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
