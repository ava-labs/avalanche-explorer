import {Module, Store} from "vuex";
import {RootState} from "@/store/types";
import Vue from "vue";
import {PlatformState, Validator} from "@/store/modules/platform/types";
import gecko_api from "@/gecko_api";
import Big from 'big.js';



const platform_module: Module<PlatformState, RootState> = {
    namespaced: true,
    state: {
        validators: [],
        validatorsPending: [],
    },
    mutations: {
    },
    actions: {
        init({dispatch}){
            dispatch('getValidators');
            dispatch('getPendingValidators');
        },
        getValidators({state}){
            let req = {
                "jsonrpc": "2.0",
                "method": "platform.getCurrentValidators",
                "params": {},
                "id": 1
            };
            gecko_api.post('',req).then(res => {
                let list = res.data.result.validators;

                let validatorList: Validator[] = list.map((val: any) => {
                    val.stakeAmount = parseInt(val.stakeAmount);
                    val.startTime = new Date(parseInt(val.startTime) * 1000);
                    val.endTime = new Date(parseInt(val.endTime) * 1000);
                    return val;
                });

                state.validators = validatorList;
            });
        },
        getPendingValidators({state}){
            let req = {
                "jsonrpc": "2.0",
                "method": "platform.getPendingValidators",
                "params": {},
                "id": 1
            };
            gecko_api.post('',req).then(res => {
                let list = res.data.result.validators;

                state.validatorsPending = list;
            });
        }
    },
    getters: {
        totalStakeAmount(state){
            let res = Big(0);

            state.validators.forEach(validator => {
                res = res.add(validator.stakeAmount)
            });
            return res;
        },
        cumulativeStakeAmount(state){
            let res: Big[] = [];
            let total = Big(0);
            state.validators.forEach(validator => {
                let val = Big(validator.stakeAmount);
                total = total.add(val);
                res.push(total)
            });
            return res;
        },

        totalStakeAmountPending(state){
            let res = Big(0);

            state.validatorsPending.forEach(validator => {
                res = res.add(validator.stakeAmount)
            });
            return res;
        },
        cumulativeStakeAmountPending(state){
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
