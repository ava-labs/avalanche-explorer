import { Transaction } from '@/js/Transaction'
import Big from 'big.js'

export interface TransactionsState {
    tx: Transaction | null
    txRes: TransactionQuery
    recentTxRes: TransactionQuery
    assetTxRes: TransactionQuery
    addressTxRes: TransactionQuery
    blockchainTxRes: TransactionQuery
    evmTx: EVMTransactionResponse | null
}

/* ==========================================
   Transactions (API)
   ========================================== */

export interface TransactionQueryResponse {
    startTime: string
    endTime: string
    next: string
    transactions: TransactionResponse[]
}
export interface TransactionQuery {
    startTime: string
    endTime: string
    next: string
    transactions: Transaction[]
}

export interface TransactionResponse {
    id: string
    chainID: string
    type: string

    inputs: InputResponse[]
    outputs: OutputResponse[]

    memo: string // base64

    inputTotals: InputTotal
    outputTotals: OutputTotal
    reusedAddressTotals: string | null

    timestamp: string

    txFee: number

    genesis: boolean

    /*
    REWARD PATTERNS - tx type: delgator/validator only
        
    0.  KEYPAIR controls UTXOs
    1.  KEYPAIR issues ADD_VALIDATOR/ADD_DELEGATOR TX
        - validator = adds node to validator (nodeId, start, end, stakeAmount, addressID (rewards destination), fee they charge delegators)
        - delegator = delegates to validator
        - once the tx is put into block and accepted:
            - Input UTXOs
                - UTXOs for staking transfer custody to the protocol (they disappear)
            - Output UTXOs
                - none for staking (output.stake boolean)
                - change UTXOs only
        - you will become a validator/delegator at the startTime
    2. endTime arrives
    3. PROTOCOL automatically issues REMOVE_VALIDATOR / REMOVE_DELEGATOR TX
        - removes the validator/delegator from validator set
        - once the tx is put into block and accepted:
            - Input UTXOs
                - none
            - Output UTXO
                - UTXOs mirroring the ADD_VALIDATOR/ADD_DELGATOR Input UTXOs are created - get your stake back
                - no UTXO appears in tx for reward...        
                - no inputs or outputs for this tx. the output UTXOs are created out of thin air    
    4. PROTOCOL creates a commit or abort block
        - if uptime is good, then you receive the reward
        P-chain blocks contain 1 tx or 0 tx
            - 1 tx = commit block 
                - contains reward UTXO
            - 0 tx = abort block
                - no reward
    5. KEYPAIR spends reward UTXO (it appears in Ortelius)
        - confirm the reward tx (points at the ADD_* tx) is issued on the x-chain
        - possibly issued on p-chain and pvm_export to x-chain to be spent

    rewarded    | rewardedTime
    false       | null          = default, someone staked
    false       | number        = reward tx was rejected for some reason (double decision block = 2tx in one block)
    true        | number        = locktime up and reward submitted
    */
    rewarded: boolean // false by default, true when a reward is committed.
    rewardedTime: string | null

    epoch: number

    vertexId: string

    validatorNodeID: string
    validatorStart: number
    validatorEnd: number

    // p-chain event. you can tie transactions together (double decision block)
    txBlockId: string // p-chain hash (might be useful to lookup)

    /*
    TODOS: exception booleans
        - genesis
        - rewarded
        - frozen
        - stakable
            - stakeLockTime
        - stakableLockedOutput (wraps transfer)
            - stakeLockTime - vesting avax. we needed a way for ppl to stake but otherwise not spend it for any other purpose                
            - lockTime
    */
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
export interface EVMBlockLog {
    address: string // '0xcb65dad78320a8d15ad8a88001324e4e163ca534'
    topics: string[] /* [
            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
            '0x00000000000000000000000077c31cd409fce1984abe6f23743bf6046de4b9e0',
            '0x0000000000000000000000003739a6ab96d4e0e4c9d51316e673766bb6e7711b'
        ] */
    data: string // '0x000000000000000000000000000000000000000000000000000000000000460c'
    blockNumber: string // '0x3e8'
    transactionHash: string // '0x98e2215034972c080eb0729f7ebe2d2e995f48485ef6a2b482de13a19e716a67'
    transactionIndex: string // '0x0'
    blockHash: string // '0x7676d0aca0c753aaf36ceefc7be9a9340616dc07ddd7d254bc41db426bb72e56'
    logIndex: string // '0x0'
    removed: boolean // false
}

/* ==========================================
   EVM Transactions
   ========================================== */
export interface EVMTransactionQueryResponse {
    Transactions: EVMTransactionResponse[]
    startTime: string // N/A - internal query logic for Ortelius DB
    endTime: string // N/A
}

/* All definitions from https://consensys.github.io/EthOn/EthOn_spec.html
    ValueTx - Just moves Ether from one account to another.
    CallTx - A type of transaction that is directed towards a contract account and calls a method in the contract's code.
    CreateTx - A type of transaction that results in creation of a new contract account.    
 */
export interface EVMTransactionResponse {
    hash: string // The Keccak 256-bit hash of the transaction
    createdAt: string // time of ingestion by Ortelius, 99& of the time this value should be the same as blockHeader.timestamp (sec granularity). different by ms

    // SENDER
    fromAddr: string /* A tx always originates from an external account that is 
                        controlled by an external actor by means of a private key */
    nonce: number // A scalar value equal to the number of transactions sent by the sender.
    // PAYLOAD
    value: string /* A scalar value equal to the number of Wei to be transferred to the Message call's recipient. 
                        In the case of contract creation it is the initial balance of 
                        the contract account, paid by the sending account. */
    input: string // An unlimited size byte array specifying the input data of the call.
    gasPrice: string /* A scalar value equal to the number of Wei to be paid per unit of gas for all 
                        computation costs incurred as a result of the execution of this transaction. */
    gasLimit: number /* A scalar value equal to the maximum amount of gas that should be used in executing this transaction. 
                        This is paid up-front, before any computation is done and may not be increased later. 
                        If used with contract messages it represents the fraction of the original transaction gas limit still 
                        available for execution of the contract message. After all resulting computations are done, 
                        excess gas is returned to the sender of the original transaction. */
    // RECIPIENT
    toAddr: string // Relates a message with the account it is sent to.
    recipient: string // duplicate to above

    // THE BLOCK CONTAINING THIS TX
    block: string // A scalar value equal to the number of ancestor blocks. The genesis block has a number of zero.
    blockGasUsed: number // A scalar value equal to the total gas used by all transactions in this block.
    blockGasLimit: number /* Will stay constant for foreseeable future
                                A scalar value equal to the current limit of gas expenditure per block. 
                                Its purpose is to keep block propagation and processing time low, 
                                thereby allowing for a sufficiently decentralized network. */
    blockHash: string // The Keccak 256-bit hash of the block's header, in its entierty.
    blockNonce: number /* Not Applicable
                            In PoW, this 64 bit hash, when combined with the mix-hash, proves
                            that a sufficient amount of computation has been carried out on this block. */

    /* EXECUTION TRACES 
        The downside of contract execution is that it is very hard to say what a transaction actually did. 
        A transaction receipt does contain a status code to check whether execution succeeded or not, 
        but there’s no way to see what data was modified, nor what external contracts where invoked. 
        In order to introspect a transaction, we need to trace its execution.
    */
    traces: TraceResponse[]

    /* TX SIGNATURE
        - used to determine the sender of the transaction
        - V, R and S correspond to the signature of the transaction */
    r: string // byte array of length 32
    s: string // byte array of length 32
    v: string /* specifies the sign and finiteness of the curve point. 
                    Since EIP-155 it is used to realize a replay attack protection. 
                    It is calculated in the following way: txV = CHAIN_ID * 2 + 36 */
}

/* EXECUTION TRACES
    This response is based on the Blockscout tracer: 
        It allows Geth's "debug_traceTransaction" to mimic 
        the output of Parity's "trace_replayTransaction".
    Objects represent ContractMsg - A contract message is passed between a 
        contract account and any other account (external or contract). It is the 
        result of an execution chain originally triggered by an external eccount.
    curl -X POST --data '{ "jsonrpc": "2.0", "method": "debug_traceTransaction","params": ["0x00000217bc17e7e3187efae9248523f4fe2bc90e029e3ba13ddd8ff69607c705", {"disableStack": true, "disableMemory": true, "disableStorage": true}],"id": 1}' -H 'content-type:application/json;' https://api.avax.network/ext/bc/C/rpc
 */

// ERROR EXAMPLE: https://explorerapi.avax-test.network/v2/ctransactions?hash=0x638a35c57a7a1545a8a6eb4ea6a3355c2d4e64657f8921fd3ff922aff86436b1
export interface TraceResponse {
    callType: string /* execution context
                        CALL ???
                        CALLCODE ???
                        DELEGATECALL - value inherited from scope during call sequencing
                        STATICCALL - by definition static calls transfer no value */
    type: string /*  one of the two values CALL and CREATE
                        CREATE - a subtype of a contract message that results in creation of a new contract account
                        CALL - CallContractMsg - a contract message that calls a function in another contract.
                        ??? SelfdestructContractMsg - a contract message that deletes the originating contract and refunds its balance to the receiver of the message.*/
    // SENDER
    from: string // Relates a message to the account it originates from.
    // PAYLOAD
    input: string // An unlimited size byte array specifying the input data of the call.
    value: string // amount to be transferred in wei
    // RECEIVER
    to: string /* Relates a message with the account it is sent to. 
                    refunds - Relates a selfdestruct contract message to the contract account it sends its refund balance to.
                    creates - Relates a create transaction to the contract account it creates. */

    gasUsed: string /* The amount of gas that was used for processing a single message
                        regardless of which type of message it may be. */
    gas: string // ??? could be msgGasLimit - A scalar value equal to the maximum amount of gas that should be used in executing this transaction. This is paid up-front, before any computation is done and may not be increased later. If used with contract messages it represents the fraction of the original transaction gas limit still available for execution of the contract message. After all resulting computations are done, excess gas is returned to the sender of the original transaction.

    traceAddress?: number[]

    error?: string // "execution reverted",
    revertReason?: string // keccak-256 encoding "0x08c379a000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000009542d4f4145582d30310000000000000000000000000000000000000000000000",
    revertReasonUnpacked?: string // "T-OAEX-01"
}

/* ==========================================
   Transactions (JS)
   ========================================== */
export interface ITransaction
    extends Omit<TransactionResponse, 'inputs' | 'outputs'> {
    inputs: Input[]
    outputs: Output[]
}

/* ==========================================
   UTXOs (API)
   ========================================== */
export interface InputResponse {
    credentials: CredentialResponse
    output: OutputResponse
}
export interface OutputResponse {
    id: string
    transactionID: string // INPUTS - the prev tx that generated this input UTXO. OUTPUTS - this tx
    redeemingTransactionID: string // INPUTS - this tx. OUTPUTS - "" if unspent, or the txID that spent this UTXO
    outputIndex: number // INPUTS - reference the UTXO index from the prev tx that generated this UTXO.
    chainID: string
    assetID: string
    timestamp: string // time of ingestion by Ortelius
    amount: string // 0 in the case of NFTs

    outputType: number
    groupID: number

    // RELEVANT TO P-CHAIN
    stake: boolean // if true, UTXO was in the staking output set (ins/outs/staking)
    stakeableout: boolean // if true, UTXO is/was subject to vesting. connected to stakeLocktime
    stakeLocktime: number // if before stakeLockTime, UTXO is vesting (locked), and can only used as input UTXO to stake in addValidator/addDelegator tx
    rewardUtxo: boolean // if true, this UTXO is the validation/delegation reward

    // RELEVANT TO X-CHAIN
    genesisutxo: boolean
    frozen: boolean // TODO: Apricot
    locktime: number
    threshold: number
    payload: string | null // NFTs

    // RELEVANT TO P-CHAIN & X-CHAIN
    addresses: string[] // notice the output UTXO address is blank. an exception for c-chain is handled in the transaction class

    // RELEVANT TO C-CHAIN
    caddresses: string[]
    block: string // https://cchain.explorer.avax.network/blocks/33726/transactions - broken block/tx
    nonce: number
    /*        
    X > SHARED DB > P/C
        1. EXPORT = move UTXO from X to SHARED DB (https://explorerapi.avax.network/v2/transactions/wQwXqfXKyoHSMCP4QVrfZgU9V7cBShJGgkZmGvkLQbHTRjhAS)
        2. ATOMIC_IMPORT = move UTXO from SHARED DB to P/C (https://explorerapi.avax.network/v2/transactions/9TMCg4ZRfa91NHJE7LgMFK6UHKP83uopHBFL3zyDc55acfMUF)
            - normally, we'd see an output UTXO, but in lieu of output UTXO, we see a C-address
                - inputs.addresses = [avax...]
                - outputs.address  = null
                - outputs.caddress = [0x..]
            - if you have hex C-addresses, then the output represented as atomic import address, you will see the actual block that wrapped that atomic import/export tx
    
    P/C > SHARED DB > X
        1. ATOMIC_EXPORT = move UTXO from P/C to SHARED DB 
        2. IMPORT = move UTXO from SHARED DB to X                                                    
    
    note: "chainID": "2q9e4r6Mu3U68nU1fYjgbR6JvwrRx36CohpAX5UQxse55x1Q5", is messed up    
    */
}

export interface CredentialResponse {
    signature: string
    public_key: string
    address: string
}

/* ==========================================
   UTXOs (JS)
   ========================================== */
export interface Input {
    credentials: CredentialResponse
    output: Output
}

export interface Output extends Omit<OutputResponse, 'timestamp' | 'amount'> {
    timestamp: Date
    amount: Big
}

export interface InputTotal {
    [key: string]: number
}

export interface OutputTotal {
    [key: string]: number
}

export interface OutputValuesDict {
    [key: string]: {
        symbol: string
        amount: Big
        denomination: number
        isNFT: boolean
    }
}

export interface OutValuesDenominated {
    [assetId: string]: {
        amount: string
        symbol: string
        assetID: string
        isNFT: boolean
    }
}

export enum OutputType {
    TRANSFERABLE = '',
    NFT_TRANSFERABLE = 'NFT',
    MINT = 'Mint',
    NFT_MINT = 'NFT Minting Rights',
    ATOMIC_EXPORT_TX = 'Atomic Export',
    ATOMIC_IMPORT_TX = 'Atomic Import',
}

export enum BlockType {
    PROPOSAL = 'Proposal',
    ABORT = 'Abort',
    COMMIT = 'Commit',
    STANDARD = 'Standard',
    ATOMIC = 'Atomic',
}
