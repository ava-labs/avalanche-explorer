export interface TxType {
    long: string
    short: string
}

export const txTypeMap = new Map<string, TxType>([
    [
        'base',
        {
            long: 'Base',
            short: '',
        },
    ],
    [
        'create_asset',
        {
            long: 'Create Asset',
            short: 'Mint',
        },
    ],
])

export function getMappingForType(type: string) {
    return txTypeMap.get(type)!.short || ''
}
