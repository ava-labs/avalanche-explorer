import { ICredentialData } from './ICredential'
import Big from 'big.js'

export interface ITransactionDataResponse {
    startTime: string
    endTime: string
    next: string
    transactions: ITransactionData[]
}

// The main Transaction type of the API
export interface ITransactionData {
    id: string
    chainID: string
    type: string

    inputs: ITransactionInputData[]
    outputs: ITransactionOutputData[]

    memo: string // base64

    inputTotals: IInputTotal
    outputTotals: IOutputTotal
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
                - none for staking
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
    txBlockId: string // p-chain hash

    /*
    TODOS: exception booleans
        - genesis
        - rewarded
        - frozen
        - stakable
            - stakeLockTime
        - stakableLockedOutput (wraps transfer)
            - stakeLockTime - vesting avax. we needed a way for ppl to stake but otherwise not spend it for any other purpose
                - can only use it as input UTXO for addValidator/addDelegator tx
            - lockTime
    */
}

export interface IInputTotal {
    [key: string]: number
}

export interface IOutputTotal {
    [key: string]: number
}

// Transaction Input type
export interface ITransactionInputData {
    credentials: ICredentialData
    output: ITransactionOutputData
}

// Transaction Output type
export interface ITransactionOutputData {
    id: string
    transactionID: string
    outputIndex: number
    assetID: string

    stake: boolean
    frozen: boolean
    stakeableout: boolean
    genesisutxo: boolean

    outputType: number
    amount: string
    locktime: number
    stakeLocktime: number
    threshold: number

    addresses: string[] // X/P addresses
    caddresses: string[] // C addresses

    timestamp: string
    redeemingTransactionID: string
    chainID: string
    groupID: number
    payload: string | null // TODO confirm

    // notice the output UTXO address is blank. build an exception for c-chain
    // https://cchain.explorer.avax.network/blocks/33726/transactions - broken block/tx
    block: string
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

export interface ITransaction {
    id: string
    chainID: string
    type: string

    inputs: ITransactionInput[]
    outputs: ITransactionOutput[]

    memo: string // base64

    inputTotals: IInputTotal
    outputTotals: IOutputTotal
    reusedAddressTotals?: string | null

    timestamp: string

    txFee: number

    genesis: boolean

    rewarded: boolean
    rewardedTime: string | null

    epoch: number

    vertexId: string

    validatorNodeID: string
    validatorStart: number
    validatorEnd: number

    txBlockId: string
}

export interface ITransactionInput {
    credentials: ICredentialData
    output: ITransactionOutput
}

export interface ITransactionOutput {
    id: string
    transactionID: string
    outputIndex: number
    assetID: string

    stake: boolean // TODO
    frozen: boolean // TODO
    stakeableout: boolean // TODO
    genesisutxo: boolean // TODO

    outputType: number
    amount: Big

    locktime: number
    stakeLocktime: number // TODO

    threshold: number

    addresses: string[]
    caddresses: string[]

    timestamp: Date
    redeemingTransactionID: string

    chainID: string
    groupID: number
    payload: string | null // TODO confirm
    block: string // TODO
    nonce: number // TODO
}

export interface OutputValuesDict {
    [key: string]: {
        symbol: string
        amount: Big
        denomination: number
    }
}

export interface IOutValuesDenominated {
    [assetId: string]: {
        amount: string
        symbol: string
    }
}
