export interface BlocksState {
    evmBlock: EVMBlockQueryResponse | null
}

/* ==========================================
   EVM Blocks
   ========================================== */
// response is the same as eth getBlock
// example https://explorerapi.avax.network/v2/ctxdata/1000
export interface EVMBlockQueryResponse {
    blockNumber: string // '1000'
    header: EVMBlockHeader
    uncles: null
    txs: null
    version: number // 0
    blockExtraData: string // ''
    transactions: EVMBlockTransaction[]
    logs: EVMBlockLog[]
}

export interface EVMBlockHeader {
    parentHash: string // '0x38c50e6d69e590682fde94c6f66aa3596c5e0a9ccc7290f7ed876ed7008ee564'
    sha3Uncles: string // '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347'
    miner: string // '0x0100000000000000000000000000000000000000'
    stateRoot: string // '0x2d0a9ba7a1462a85c770e6d6d25ec10c7488707ed946977a14c934d4ef534506'
    transactionsRoot: string // '0x97d585d1361a1a605e996f9b4fcd170fe0002f97b8f41b0dd49778a6f28f81a5'
    receiptsRoot: string // '0x4b59332f20afb63eae88492640524f29451491d02abf59d9250136cb4a0adfdb'
    logsBloom: string // '0x00000000000000000000000000000000000100000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000008000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000004000000000000001020000000000000000000000000000000000000000000000000000000000002000000000001000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000'
    difficulty: string // '0x1'
    number: string // '0x3e8'
    gasLimit: string // '0x23e6441'
    gasUsed: string // '0x7d71'
    timestamp: string // '0x5fde8d3b'
    extraData: string // '0xd883010916846765746888676f312e31352e35856c696e75783ae348c32855703315cdd63cb0e75ee2d2fb932daab4d17377098975ab12e495'
    mixHash: string // '0x0000000000000000000000000000000000000000000000000000000000000000'
    nonce: string // '0x0000000000000000'
    extDataHash: string // '0x0000000000000000000000000000000000000000000000000000000000000000'
    hash: string // '0x7676d0aca0c753aaf36ceefc7be9a9340616dc07ddd7d254bc41db426bb72e56'
}

export interface EVMBlockTransaction {
    hash: string // '0x98e2215034972c080eb0729f7ebe2d2e995f48485ef6a2b482de13a19e716a67'
    type: string // '0x0'
    // SENDER (v,r,s resolves to fromAddr)
    v: string // '0x150f8'
    r: string // '0x3b6e48994f3c46853ae729439d45c8e96c659a5236a22d74e0ba8ec82a189441'
    s: string // '0x2d001e06c4ab3658fd75720ed7625a33d4cd513d0a8f4317827def37395ac27f'
    nonce: string // '0x17'
    // PAYLOAD
    value: string // '0x0'
    input: string // '0xa9059cbb0000000000000000000000003739a6ab96d4e0e4c9d51316e673766bb6e7711b000000000000000000000000000000000000000000000000000000000000460c'
    gasPrice: string // '0x6d6e2edc00'
    gas: string // '0x7d71'
    // RECIPIENT
    to: string // '0xcb65dad78320a8d15ad8a88001324e4e163ca534'
}

// https://docs.soliditylang.org/en/v0.8.4/abi-spec.html#events
// Filtering logs https://docs.ethers.io/v5/concepts/events/#events--logs-and-filtering
export interface EVMBlockLog {
    address: string // the address of the contract that emitted the event
    // intrinsically provided by Ethereum
    // '0xcb65dad78320a8d15ad8a88001324e4e163ca534'
    topics: string[] /* topics[0] = keccak(EVENT_NAME+"("+EVENT_ARGS.map(canonical_type_of).join(",")+")")
                            canonical_type_of is a function that simply returns 
                            the canonical type of a given argument 
                            e.g. for uint indexed foo, it would return uint256). 
                            If the event is declared as anonymous the topics[0] is not generated;
                        topics[n] = abi_encode(EVENT_INDEXED_ARGS[n - 1]) 
                            EVENT_INDEXED_ARGS is the series of EVENT_ARGS that are indexed;*/
    data: string /* ABI encoding of EVENT_NON_INDEXED_ARGS 
                    EVENT_NON_INDEXED_ARGS is the series of EVENT_ARGS that are not indexed, 
                    abi_encode is the ABI encoding function used for returning a series of 
                    typed values from a function, as described above.
                    '0x000000000000000000000000000000000000000000000000000000000000460c'
                    */

    blockNumber: string // '0x3e8'
    transactionHash: string // '0x98e2215034972c080eb0729f7ebe2d2e995f48485ef6a2b482de13a19e716a67'
    transactionIndex: string // '0x0'
    blockHash: string // '0x7676d0aca0c753aaf36ceefc7be9a9340616dc07ddd7d254bc41db426bb72e56'
    logIndex: string // '0x0'
    removed: boolean // false
}
