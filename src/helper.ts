import Big from 'big.js';
import AddressDict from './known_addresses';
import SubnetDict from './known_subnets';
import BlockchainDict from './known_blockchains';
import VMDict from './known_vms';
import {Quote, quotes} from './quotes';

function stringToBig(raw: string, denomination = 0): Big {
    return Big(raw).div(Math.pow(10, denomination));
}

function toAVAX(nAVAX: string | number): number {
    return (typeof nAVAX === "string") ?
        parseInt(nAVAX) / Math.pow(10, 9) :
        nAVAX / Math.pow(10, 9);
}

function bigToDenomString(val: Big, denomination = 0) {
    return val.div(Math.pow(10, denomination));
}

// TODO: support for multiple chains. add a chain param
function addressMap(addr: string): string {
    if (AddressDict[addr]) {
        return AddressDict[addr]
    } else {
        return 'X-' + addr;
    }
}

function subnetMap(id: string): string {
    if (SubnetDict[id]) {
        return SubnetDict[id]
    } else {
        return id;
    }
}

function blockchainMap(id: string): string {
    if (BlockchainDict[id]) {
        return BlockchainDict[id]
    } else {
        return id;
    }
}

function VMMap(id: string): string {
    if (VMDict[id]) {
        return VMDict[id].name
    } else {
        return id;
    }
}

function VMDocumentationMap(id: string): string {
    if (VMDict[id]) {
        return VMDict[id].documentation
    } else {
        return "";
    }
}

function getRandomQuote(): Quote {
    return quotes[Math.floor(Math.random() * quotes.length)];
}

function countDecimals(value: number): [boolean, number] {
    if (value <= 1e-7) {
        return [true, parseInt(value.toString().split("-")[1])];
    } else if (Math.floor(value) !== value) {
        return [false, value.toString().split(".")[1].length || 0];
    }
    return [false, 0];
}

function trimmedLocaleString(amount: Big, denomination: number = 0, normalize: boolean = true): string {
    // produce a localeString with trimmed trailing 0s
    // e.g. 44999999.999120000 to 44,999,999.99912
    
    // convert and denominate
    let denominatedAmt = normalize ? 
        amount.div(Math.pow(10, denomination)).toFixed(denomination) : 
        amount.toFixed(denomination);
    
    // determine cutoff point for trailing 0s 
    // handle scientific notation and decimal formats
    let scientific: boolean; 
    let decimalPlaces: number;
    let number = parseFloat(denominatedAmt);
    [scientific, decimalPlaces] = countDecimals(number);
            
    return scientific ? 
        amount.div(Math.pow(10, denomination)).toFixed(denomination) :
        amount.div(Math.pow(10, denomination)).toLocaleString(decimalPlaces);
}

export {
    toAVAX,
    stringToBig,
    bigToDenomString,
    addressMap,
    subnetMap,
    blockchainMap,
    VMMap,
    VMDocumentationMap,
    getRandomQuote,
    trimmedLocaleString
}
