import { Module } from "vuex";
import { IRootState } from "@/store/types";
import { INetworkState } from "@/store/modules/network/types";
import { avalanche } from "@/avalanche";
import Network from "@/js/Network";
import axios from "@/axios";

const network_module: Module<INetworkState, IRootState> = {
    namespaced: true,
    state: {
        status: "disconnected", // disconnected | connecting | connected
        networks: [],
        selectedNetwork: null
    },
    mutations: {
        addNetwork(state, net: Network){
            state.networks.push(net);
        },
    },
    actions: {
        async init({state, commit, dispatch}) {
            let everest = new Network(
                "Everest TestNet", 
                "https://testapi.avax.network:443", 
                4, 
                "X", 
                "https://explorerapi.avax.network"
            );
            let manhattan = new Network(
                "Manhattan TestNet", 
                "https://api.avax.network:443", 
                0, 
                "X", 
                "https://54.211.125.40"
            );

            commit("addNetwork", everest);
            commit("addNetwork", manhattan);
            
            // initialize selected network
            try {
                let res = await dispatch("setNetwork", state.networks[0]);
                return true;
            } catch (e) {
                console.log(e);
                state.status = "disconnected";
            }
        },
        async setNetwork({state}, net: Network): Promise<boolean> { 
            // Query the network to get network id
            state.status = "connecting";
            avalanche.setAddress(net.ip, net.port, net.protocol);
            avalanche.setNetworkID(net.networkId);
            avalanche.XChain().refreshBlockchainID();

            state.selectedNetwork = net;
            axios.defaults.baseURL = net.explorerUrl;

            state.status = "connected";
            return true;
        },
    },
};

export default network_module;
