import {
    CanonicEventSignature,
    CanonicSignature,
    DecodedContractResponse,
} from '@/services/sources/models'

export interface SourcesState {
    abisLoaded: boolean
    abis: any | null
    abiDecoder: any
    signatures: CanonicSignature[]
    eventSignatures: CanonicEventSignature[]
    verifiedContracts: DecodedContractMap
}

export interface DecodedContractMap {
    [key: string]: DecodedContractResponse
}
