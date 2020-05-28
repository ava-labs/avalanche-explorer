import Big from 'big.js';
import AddressDict from './known_addresses';
import SubnetDict from './known_subnets'

function stringToBig(raw: string, denomination = 0): Big {
    return Big(raw).div(Math.pow(10, denomination));
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

export {
    stringToBig,
    bigToDenomString,
    addressMap,
    subnetMap
}
