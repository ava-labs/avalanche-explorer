import { Module } from "vuex";
import { IRootState } from "@/store/types";
import { IPlatformState } from "./IPlatformState";
import { IBlockchain, IBlockchainData } from "@/store/modules/platform/IBlockchain";
import { IValidator, IValidatorData } from "@/store/modules/platform/IValidator";
import gecko_api from "@/gecko_api";
import { platform } from "@/ava";
import Big from "big.js";

const platform_module: Module<IPlatformState, IRootState> = {
    namespaced: true,
    state: {
        subnets: [],
        blockchains: [],
        validators: [],
        validatorsPending: [],
    },
    mutations: {
    },
    actions: {
        async init({ dispatch }) {
            await dispatch("getBlockchains");
            await dispatch("addPChain");
            dispatch("getSubnets")
            dispatch("getValidators");
            dispatch("getPendingValidators");
        },
        async getBlockchains({ state }) {
            await platform.getBlockchains()
                .then((res: object[]) => state.blockchains = res as IBlockchainData[])
                .catch((error: Error) => console.log(error.message));

            function getBlockchainStatus(subnetID: string) {
                return platform.getBlockchainStatus(subnetID)
                    .then(res => res)
                    .catch(error => console.log(error));
            }

            await state.blockchains.forEach(async b => {
                await Promise.all([
                    getBlockchainStatus(b.id)
                ]).then(values => {
                    b.status = values[0] as string | undefined;
                });
            });
        },
        async addPChain({ state }) {
            let pChain: IBlockchain = {
                name: "P-Chain",
                id: "11111111111111111111111111111111LpoYY",
                subnetID: "11111111111111111111111111111111LpoYY",
                vmID: "???",
                status: ""
            };

            function getBlockchainStatus(subnetID: string) {
                return platform.getBlockchainStatus(subnetID)
                    .then(res => res)
                    .catch(error => console.log(error));
            }

            await Promise.all([
                getBlockchainStatus(pChain.id),
            ]).then(values => {
                pChain.status = values[0] as string | undefined;
            });
            
            state.blockchains.push(pChain);
        },
        getSubnets({ state }) {
            // move this to a getteer
            let subnets = [...new Set(state.blockchains.map(b => b.subnetID))];
            state.subnets = subnets.map(s => {
                return {
                    id: s,
                    blockchains: state.blockchains.filter(b => b.subnetID === s)
                };
            });
            console.log("subnets", state.subnets);
        },
        getValidators({ state }, subnetID: string | undefined = undefined) {
            // TODO: use Slopes when types are fixed
            let req = {
                "jsonrpc": "2.0",
                "method": "platform.getCurrentValidators",
                "params": {},
                "id": 1
            };

            gecko_api.post("", req).then(res => {
                let validatorList: IValidator[] = res.data.result.validators
                    .map((val: IValidatorData) => ({
                        id: val.id,
                        stakeAmount: parseInt(val.stakeAmount),
                        startTime: new Date(parseInt(val.startTime) * 1000),
                        endTime: new Date(parseInt(val.endTime) * 1000)
                    }));
                state.validators = validatorList;
            });
        },
        getPendingValidators({ state }) {
            // TODO: use Slopes when types are fixed
            let req = {
                "jsonrpc": "2.0",
                "method": "platform.getPendingValidators",
                "params": {},
                "id": 1
            };
            gecko_api.post("", req).then(res => {
                let list = res.data.result.validators;
                state.validatorsPending = list;
            });
        }
    },
    getters: {
        totalStakeAmount(state) {
            let res = Big(0);
            state.validators.forEach(validator => {
                res = res.add(validator.stakeAmount)
            });
            return res;
        },
        cumulativeStakeAmount(state) {
            let res: Big[] = [];
            let total = Big(0);
            state.validators.forEach(validator => {
                let val = Big(validator.stakeAmount);
                total = total.add(val);
                res.push(total)
            });
            return res;
        },
        totalStakeAmountPending(state) {
            let res = Big(0);
            state.validatorsPending.forEach(validator => {
                res = res.add(validator.stakeAmount)
            });
            return res;
        },
        cumulativeStakeAmountPending(state) {
            let res: Big[] = [];
            let total = Big(0);
            state.validatorsPending.forEach(validator => {
                let val = Big(validator.stakeAmount);
                total = total.add(val);
                res.push(total)
            });
            return res;
        }
    }
};

export default platform_module;
