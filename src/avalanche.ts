import * as avalancheJS from "avalanche";
const IP = process.env.VUE_APP_AVALANCHE_JS_IP;
const PORT = parseInt(process.env.VUE_APP_AVALANCHE_JS_PORT!);
const PROTOCOL = process.env.VUE_APP_AVALANCHE_JS_PROTOCOL;
const NETWORK_ID = process.env.VUE_APP_AVALANCHE_JS_NETWORKID!;
const CHAIN_ID = process.env.VUE_APP_AVALANCHE_JS_CHAINID;

let avalanche = new avalancheJS.Avalanche(IP!, PORT, PROTOCOL, parseInt(NETWORK_ID), CHAIN_ID);
let avm = avalanche.XChain();
let platform = avalanche.PChain();

export {avalanche, avm, platform};
