import Big from 'big.js';
import AddressDict from './known_addresses';
import SubnetDict from './known_subnets';
import BlockchainDict from './known_blockchains';
import {Quote, quotes} from './quotes';

function stringToBig(raw: string, denomination = 0): Big {
    return Big(raw).div(Math.pow(10, denomination));
}

function toAVA(nAVA: string | number): number {
    return (typeof nAVA === "string") ?
        parseInt(nAVA) / Math.pow(10, 9) :
        nAVA / Math.pow(10, 9);
}

function bigToDenomString(val: Big, denomination = 0) {
    return val.div(Math.pow(10, denomination));
}

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

function getRandomQuote(): Quote {
    return quotes[Math.floor(Math.random() * quotes.length)];
}

export {
    toAVA,
    stringToBig,
    bigToDenomString,
    addressMap,
    subnetMap,
    blockchainMap,
    getRandomQuote
}
