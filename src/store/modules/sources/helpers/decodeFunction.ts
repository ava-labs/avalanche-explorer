import { DecodedFunction } from '..'

export function decodeFunction(data: string, abiDecoder: any) {
    // console.log('input:         ', input)
    // console.log('abiDecoder:    ', abiDecoder.getMethodIDs())
    const decodedData: DecodedFunction | undefined = abiDecoder.decodeMethod(
        data
    )
    // console.log('decodedData:     ', decodedData)
    return decodedData
}
