import * as avalancheJS from "avalanche";
const IP = "explorerapi.avax.network";
const PORT = 21000;
const PROTOCOL = "https";
const NETWORK_ID = "3";
const CHAIN_ID = "X";

let avalanche = new avalancheJS.Avalanche(IP, PORT, PROTOCOL, parseInt(NETWORK_ID), CHAIN_ID);
let avm = avalanche.AVM();
let platform = avalanche.Platform();

export {avalanche, avm, platform};
