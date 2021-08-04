/* ==========================================
   Verified Contracts
   ========================================== */

export interface DecodedContractResponse {
    address: string
    name: string | null
    abi: string | null
    sourcecode: string | null
    constructorArgs: string | null
    deployedBytecode: string | null
}

/* ==========================================
   4-Byte Signature Database
   ========================================== */

export interface FunctionSignatureResponse {
    count: number
    next: null
    previous: null
    results: FunctionSignature[]
}

export interface FunctionSignature {
    id: number // 1
    text_signature: string // 'balanceOf(address)'
    bytes_signature: string // "r'\x13\xf7"
    hex_signature: string // '0x722713f7'
}

// Event signatures are normalized during creation.
// The normalization process can handle a wide array of input formats.
export interface EventSignatureResponse {
    count: number
    next: null
    previous: null
    results: EventSignature[]
}

export interface EventSignature {
    id: number // 1
    created_at: string // '2020-09-13T18:45:58.559831Z'
    text_signature: string // 'RequestCreated(address,address,int256,uint256[12])'
    hex_signature: string // '0x15aac4af776447c09d895192c86bab463c38b92191f3ba3f7b8831723c548d6e'
    bytes_signature: string // "r'\x15\xaa\xc4\xafwdG\xc0\x9d\x89Q\x92\xc8k\xabF18\xb9!\x91\xf3\xba?{\x881r1T\x8dn"
}
