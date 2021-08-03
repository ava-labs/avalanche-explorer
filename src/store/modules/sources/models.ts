import {
    CanonicEventSignature,
    CanonicSignature,
} from '@/services/sources/models'

export interface SourcesState {
    abisLoaded: boolean
    abis: any | null
    abiDecoder: any
    signatures: CanonicSignature[]
    eventSignatures: CanonicEventSignature[]
}
