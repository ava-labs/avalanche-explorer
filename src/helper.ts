
import Big from 'big.js';

function stringToBig(raw: string, denomination = 0){
    return Big(raw).div(Math.pow(10,denomination));
}

function bigToDenomString(val: Big, denomination = 0){
    return val.div(Math.pow(10,denomination));
}



export {
    stringToBig,
    bigToDenomString
}
