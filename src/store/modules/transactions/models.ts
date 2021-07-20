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
   UTXO Transactions (API)
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

    // https://docs.avax.network/learn/platform-overview/transaction-fees#fee-schedule
    /* Multi-sig txFee scenarios
        A. 1-of-2 ms UTXO  =>  UTXO (equal)      both parties paid the fee.
                               UTXO (equal) 
        
        B. 1-of-2 ms UTXO  =>  UTXO (equal)      person that owned the non-multisig output paid more of a % of the fee.
              non-ms UTXO      UTXO (equal)
        
        C. 1-of-2 ms UTXO  =>  UTXO              person that ended up w/ out output paid the fee because the other person was reimbursed.
              non-ms UTXO
     */
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
        but there’s no way to see what data was modified, nor what external contracts were invoked. 
        In order to introspect a transaction, we need to trace its execution.
        Example: https://explorerapi.avax.network/v2/ctransactions?hash=0xbe5960deded935d9cbea94ea9e944699db668646dba9d20bcfda921f979bfd87
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
export interface TraceResponse {
    callType: string /* execution context
                        "" - when it's a CREATE
                        CALL - executes in scope of contract
                        DELEGATECALL - executes in scope of caller contract. value inherited from scope during call sequencing
                        STATICCALL - by definition static calls transfer no value */
    type: string /*  one of the two values CALL and CREATE
                        CREATE - a subtype of a contract message that results in creation of a new contract account
                        CALL - CallContractMsg - a contract message that calls a function in another contract.
                        ??? SelfdestructContractMsg - a contract message that deletes the originating contract and refunds its balance to the receiver of the message.*/
    // SENDER
    from: string // Relates a message to the account it originates from.
    // PAYLOAD
    input: string // An unlimited size byte array specifying the input data of the call.
    output?: string // return value
    value: string // amount to be transferred in wei
    // RECEIVER
    to: string /* Relates a message with the account it is sent to. 
                    refunds - Relates a selfdestruct contract message to the contract account it sends its refund balance to.
                    creates - Relates a create transaction to the contract account it creates. */

    gasUsed: string /* The amount of gas that was used for processing a single message
                        regardless of which type of message it may be. */
    gas: string // ??? could be msgGasLimit - A scalar value equal to the maximum amount of gas that should be used in executing this transaction. This is paid up-front, before any computation is done and may not be increased later. If used with contract messages it represents the fraction of the original transaction gas limit still available for execution of the contract message. After all resulting computations are done, excess gas is returned to the sender of the original transaction.

    traceAddress?: number[]

    createdContractAddressHash?: string
    createdContractCode?: string

    // ERROR EXAMPLE: https://explorerapi.avax-test.network/v2/ctransactions?hash=0x638a35c57a7a1545a8a6eb4ea6a3355c2d4e64657f8921fd3ff922aff86436b1
    error?: string // "execution reverted",
    revertReason?: string // keccak-256 encoding "0x08c379a000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000009542d4f4145582d30310000000000000000000000000000000000000000000000",
    revertReasonUnpacked?: string // "T-OAEX-01"

    children?: TraceResponse[]
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
