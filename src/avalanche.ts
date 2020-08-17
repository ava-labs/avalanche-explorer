import * as avalancheJS from "avalanche";
const IP = "testapi.avax.network";
const PORT = 443;
const PROTOCOL = "https";
const NETWORK_ID = "3";
const CHAIN_ID = "X";

let avalanche = new avalancheJS.Avalanche(IP, PORT, PROTOCOL, parseInt(NETWORK_ID), CHAIN_ID);
let avm = avalanche.XChain();
let platform = avalanche.PChain();

export {avalanche, avm, platform};
