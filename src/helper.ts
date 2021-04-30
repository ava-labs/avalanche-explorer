import Big from 'big.js'
import SubnetDict from './known_subnets'
import BlockchainDict, { C, P, X } from './known_blockchains'
import VMDict from './known_vms'
import { Quote, quotes } from './quotes'
import { BN, Buffer } from 'avalanche/dist'
import { NFTTransferOutput, UTXO } from 'avalanche/dist/apis/avm'
import { PayloadBase, PayloadTypes } from 'avalanche/dist/utils'
import { NetworkIDToHRP } from 'avalanche/dist/utils/constants'
import { DEFAULT_NETWORK_ID } from './store/modules/network/network'

function stringToBig(raw: string, denomination = 0): Big {
    return Big(raw).div(Math.pow(10, denomination))
}

/**
 * Convert nAvax to Avax
 * @param nAVAX nAvax amount
 */
function nAvaxToAVAX(nAVAX: string | number): number {
    return typeof nAVAX === 'string'
        ? parseInt(nAVAX) / Math.pow(10, 9)
        : nAVAX / Math.pow(10, 9)
}

function bigToDenomBig(val: Big, denomination = 0): Big {
    return val.div(Math.pow(10, denomination))
}

function bnToBig(val: BN, denomination = 0): Big {
    return new Big(val.toString()).div(Math.pow(10, denomination))
}

function subnetMap(id: string): string {
    if (SubnetDict[id]) {
        return SubnetDict[id]
    } else {
        return id
    }
}

function blockchainMap(id: string): string {
    if (BlockchainDict[id]) {
        return BlockchainDict[id].name
    } else {
        return id
    }
}

function VMMap(id: string): string {
    if (VMDict[id]) {
        return VMDict[id].name
    } else {
        return id
    }
}

function VMDocumentationMap(id: string): string {
    if (VMDict[id]) {
        return VMDict[id].documentation
    } else {
        return ''
    }
}

function getRandomQuote(): Quote {
    return quotes[Math.floor(Math.random() * quotes.length)]
}

function countDecimals(value: number): [boolean, number] {
    if (value <= 1e-7) {
        return [true, parseInt(value.toString().split('-')[1])]
    } else if (Math.floor(value) !== value) {
        return [false, value.toString().split('.')[1].length || 0]
    }
    return [false, 0]
}

function trimmedLocaleString(
    amount: Big,
    denomination = 0,
    normalize = true
): string {
    // produce a localeString with trimmed trailing 0s
    // e.g. 44999999.999120000 to 44,999,999.99912

    // convert and denominate
    const denominatedAmt = normalize
        ? amount.div(Math.pow(10, denomination)).toFixed(denomination)
        : amount.toFixed(denomination)

    // determine cutoff point for trailing 0s
    // handle scientific notation and decimal formats
    const number = parseFloat(denominatedAmt)
    const [scientific, decimalPlaces] = countDecimals(number)

    return scientific
        ? amount.div(Math.pow(10, denomination)).toFixed(denomination)
        : amount.div(Math.pow(10, denomination)).toLocaleString(decimalPlaces)
}

const payloadtypes = PayloadTypes.getInstance()

function getPayloadFromUTXO(utxo: UTXO): PayloadBase {
    const out = utxo.getOutput() as NFTTransferOutput
    const payload = out.getPayloadBuffer()
    const typeId = payloadtypes.getTypeID(payload)
    const pl = payloadtypes.getContent(payload)
    const payloadbase: PayloadBase = payloadtypes.select(typeId, pl)
    return payloadbase
}

function pushPayload(rawPayload: string, assetID: string, groupID: number) {
    const res: { [key in string]: { [key in string]: PayloadBase[] } } = {}
    let payload = Buffer.from(rawPayload, 'base64')
    payload = Buffer.concat([new Buffer(4).fill(payload.length), payload])

    try {
        const typeId = payloadtypes.getTypeID(payload)
        const pl = payloadtypes.getContent(payload)
        const payloadbase: PayloadBase = payloadtypes.select(typeId, pl)

        if (res[assetID]) {
            if (res[assetID][groupID]) {
                return res[assetID][groupID].push(payloadbase)
            } else {
                return (res[assetID] = {
                    [groupID]: [payloadbase],
                })
            }
        } else {
            return (res[assetID] = {
                [groupID]: [payloadbase],
            })
        }
    } catch (e) {
        console.error(e)
    }
}

function backgroundColor(address: string) {
    const prefix = address.charAt(0)
    switch (prefix) {
        case 'P':
            return P.darkColor
        case 'X':
            return X.darkColor
        case 'C':
            return C.darkColor
        case '0':
            return C.darkColor
        default:
            return '#e4e4e4'
    }
}

const firstChars = 6
const lastChars = 6

function abbreviateBech32(address: string) {
    const separatorPos = Array.from(address).findIndex((i) => i === '1') + 1
    const prefix = address.substring(0, 2)
    const hrp = address.substring(prefix.length, separatorPos)
    const addressAbbrev = address.substring(
        separatorPos,
        separatorPos + firstChars
    )
    const checksum = address.substr(address.length - lastChars, lastChars)
    return [prefix, hrp, addressAbbrev, '...', checksum]
}

function abbreviateHex(address: string) {
    const prefix = address.substring(0, 2)
    // @ts-ignore
    const hrpLength = NetworkIDToHRP[DEFAULT_NETWORK_ID].length
    const addressFirst = address.substring(
        prefix.length,
        prefix.length + 1 + hrpLength + firstChars
    )
    const addressLast = address.substr(address.length - lastChars, lastChars)
    return [prefix, addressFirst, '...', addressLast]
}

export {
    nAvaxToAVAX as toAVAX,
    stringToBig,
    bigToDenomBig,
    bnToBig,
    subnetMap,
    blockchainMap,
    VMMap,
    VMDocumentationMap,
    getRandomQuote,
    trimmedLocaleString,
    getPayloadFromUTXO,
    pushPayload,
    backgroundColor,
    abbreviateBech32,
    abbreviateHex,
}
