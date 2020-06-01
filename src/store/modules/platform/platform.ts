import { Module } from "vuex";
import { IRootState } from "@/store/types";
import { IPlatformState } from './IPlatformState';
import { IValidator, IValidatorData } from "@/store/modules/platform/IValidator";
import gecko_api from "@/gecko_api";
import Big from "big.js";

const platform_module: Module<IPlatformState, IRootState> = {
    namespaced: true,
    state: {
        validators: [],
        validatorsPending: [],
    },
    mutations: {
    },
    actions: {
        init({ dispatch }) {
            dispatch("getValidators");
            dispatch("getPendingValidators");
        },
        getValidators({ state }) {
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
