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

export {
    toAVAX,
    stringToBig,
    bigToDenomString,
    addressMap,
    subnetMap,
    blockchainMap,
    VMMap,
    VMDocumentationMap,
    getRandomQuote
}
