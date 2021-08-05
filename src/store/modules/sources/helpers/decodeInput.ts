export function decodeTxData(input: string, abiDecoder: any) {
    const isDecoded = abiDecoder.decodeMethod(input)
    console.log('isDecoded', isDecoded)
    return isDecoded
}
