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
    header: EVMBlockHeader /* Relates a block to its block header data. The property is functional 
                                because a block can have only exactly one block header. */
    transactions: EVMBlockTransaction[]
    logs: EVMBlockLog[] | null
    blockExtraData: string /* An arbitrary byte array containing data relevant to this block. 
                                Contains atomic transactions (cross-chain imports/exports) in Avalanche 
                                Must be 32 bytes or fewer. */

    // NOT APPLICABLE
    version: number /* N/A - Intended to provide a version of the ExtraData field. Deprecated since we 
                        can just use our codec to reason about how that should be versioned. */
    uncles: null // N/A due to Snow Consensus
    txs: null // N/A
}

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

    // USED FOR AVALANCHE ATOMIC TRANSACTIONS
    extraData: string /* Ignore this as the ingested data is obfuscated by Ortelius. 
                            An arbitrary byte array containing data relevant to this block. This must be 32 bytes or fewer.*/
    extDataHash: string /* This will map to the block.blockExtraData in the level above */

    // NOT APPLICABLE - ARTIFACTS OF PROOF OF WORK
    difficulty: string // The difficulty level of this block.
    mixHash: string /* A 256-bit hash which proves combined with the nonce that a 
                        sufficient amount of computation has been carried out on this block. */
    nonce: string /* 64 bit hash which proves combined with the mix-hash 
                        that a sufficient amount of computation has been carried out on this block.*/
    sha3Uncles: string /* Relates a block to another block by including it as an uncle. 
                            Block B can be an uncle of block A if it is the direct child 
                            of the k'th generation ancestor of block B, where 2<=k<=7 
                            but not a direct ancestor of block A. Uncles are blocks found by a miner, 
                            when a different miner has already found another block for the corresponding 
                            place in the blockchain. They are also known as “stale blocks”. */
}

// Refer to annotations in EVM transaction model
export interface EVMBlockTransaction {
    hash: string
    type: string
    // SENDER (v,r,s resolves to fromAddr)
    v: string
    r: string
    s: string
    nonce: string
    // PAYLOAD
    value: string
    input: string
    gasPrice: string
    gas: string
    // RECIPIENT
    to: string
}

/* 
    A log entry is the result of an event in a smart contract, 
    emitted during creation or execution of a contract account's code. 
    It is related to the TxReceipt it was created in, 
    the contract account that had the event, 
    a series of 32-bytes log topics and a number of bytes of data. 
    
    https://docs.soliditylang.org/en/v0.8.4/abi-spec.html#events
    Filtering logs https://docs.ethers.io/v5/concepts/events/#events--logs-and-filtering
*/
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

    blockNumber: string
    blockHash: string
    transactionHash: string
    transactionIndex: string
    logIndex: string //
    removed: boolean //
}
