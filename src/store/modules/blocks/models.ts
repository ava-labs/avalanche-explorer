export interface BlocksState {
    evmBlock: EVMBlockQueryResponse | null
}

/* ==========================================
   EVM Blocks
   ========================================== */

/* 
    A block is the basic element of a 'blockchain'. 
    It functions as an entry in a distributed ledger, recording a series of transactions 
    together with a reference to the previous block. A block is chained to its preceeding 
    block by a cryptographic hash of its contents as a means of reference. Blocks contain 
    an identifier for the final state after all transactions contained in it are validated. 
    There is a consensus mechanism that provides incentives for nodes adding new blocks to 
    the chain that comply with the rules of Avalanche by burning tokens ('AVAX') to an account 
    specified by the protocol.

    Current API response is the same as eth.getBlock (https://explorerapi.avax.network/v2/ctxdata/1000)
*/
export interface EVMBlockQueryResponse {
    blockNumber: string // A scalar value equal to the number of ancestor blocks. The genesis block has a number of zero.
    version: number //
    header: EVMBlockHeader
    transactions: EVMBlockTransaction[]
    blockExtraData: string /* An arbitrary byte array containing data relevant to this block. 
                                Contains atomic transactions (cross-chain imports/exports) in Avalanche 
                                Must be 32 bytes or fewer. */
    logs: EVMBlockLog[]
    uncles: null // N/A
    txs: null // N/A
}

// Relates a block to its block header data. The property is functional because a block can have only exactly one block header.
export interface EVMBlockHeader {
    number: string // A scalar value equal to the number of ancestor blocks. The genesis block has a number of zero.
    timestamp: string // This block's inception date and time.

    // MODIFIED MERKLE PATRICIA TREE
    hash: string // The Keccak 256-bit hash of the block's header, in its entierty.
    parentHash: string /* Relates a block to its parent in the chain. It always points to the block with 
                            a number that is decreased by one, compared to the block it originates from. 
                            The relation is asymmetric because if block A is parent to block B 
                            then block B can not be parent to block A. It is also irreflexive because 
                            a block cannot be parent to itself. */
    stateRoot: string // The Keccak 256-bit hash of the root node of the state trie that represents this state.
    transactionsRoot: string /* The Keccak 256-bit hash of the root node of the trie structure populated 
                                with each transaction in the transactions list portion of the block. */
    receiptsRoot: string /* The Keccak 256-bit hash of the root node of the trie structure populated with 
                            the receipts of each transaction in the transactions list portion of the block. 
                            Each block has a reference to the root hash of a receipts trie 
                            that stores the receipts of the transactions included in the block. */

    // BLOCK SIZE
    gasLimit: string /* A scalar value equal to the current limit of gas expenditure per block. 
                        Its purpose is to keep block propagation and processing time low, 
                        thereby allowing for a sufficiently decentralized network. */
    gasUsed: string // A scalar value equal to the total gas used by all transactions in this block.
    miner: string // C-chain burn address

    // LOGS
    logsBloom: string /* The bloom filter of log entries resulting from the transactions in the block. 
                            The bloom filter helps to identify blocks with logs quickly. 
                            To find the indexed log entries from a contract, only the bloom filters 
                            of all blocks, which are included in the block header have to be checked. 
                            Note that bloom filters can produce false positives but not false negatives. 
                            In other words, if the bloom filter indicates that the topic and contract have 
                            not produced any logs in a block, this information is final. If the bloom filter 
                            indicates a match, it is only a probabilistic result and has to be verified further. 
                            The transactions in the block can then be re-executed and the probabilistic 
                            match of the bloom filter can be verified. */

    // USED FOR AVALANCHE ATOMIC TRANSACTIONS AND ARBITRARY USES BY VALIDATORS
    extraData: string //
    extDataHash: string //

    // NOT APPLICABLE - ARTIFACTS OF PROOF OF WORK
    difficulty: string // The difficulty level of this block.
    mixHash: string /* A 256-bit hash which proves combined with the nonce that a 
                        sufficient amount of computation has been carried out on this block. */
    nonce: string /* 64 bit hash which proves combined with the mix-hash 
                        that a sufficient amount of computation has been carried out on this block.*/
    sha3Uncles: string //
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
    address: string /* the address of the contract that emitted the event
                        intrinsically provided by Ethereum */
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
                    typed values from a function, as described above.*/

    blockNumber: string //
    transactionHash: string //
    transactionIndex: string //
    blockHash: string //
    logIndex: string //
    removed: boolean //
}
