import * as slopes from "slopes"
let AVA_IP = '64.227.61.251';
let AVA_PORT = 9650;
let AVA_PROTOCOL = 'https';
let AVA_NETWORK_ID = '3';
let AVA_CHAIN_ID = 'X';

let ava = new slopes.Slopes(AVA_IP, AVA_PORT, AVA_PROTOCOL, parseInt(AVA_NETWORK_ID), AVA_CHAIN_ID);
let avm = ava.AVM();
let platform = ava.Platform();
console.log("ava", ava);
console.log(platform.getBlockchains().then(res => res));

export {ava, avm, platform};
