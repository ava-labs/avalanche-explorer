// currently these most of these interfaces reside in ITransaction file but
// this should be fixed is AS-643

export enum OutputType {
    TRANSFERABLE = 'Transferable',
    NFT_TRANSFERABLE = 'NFT Transferable',
    MINT = 'Mint',
    NFT_MINT = 'NFT Mint',
    ATOMIC_EXPORT_TX = 'Atomic Export Tx',
    ATOMIC_IMPORT_TX = 'Atomic Import Tx',
}

export enum BlockType {
    PROPOSAL = 'Proposal',
    ABORT = 'Abort',
    COMMIT = 'Commit',
    STANDARD = 'Standard',
    ATOMIC = 'Atomic',
}
