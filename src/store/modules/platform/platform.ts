import {Module, Store} from "vuex";
import {RootState} from "@/store/types";
import Vue from "vue";
import {PlatformState, Validator} from "@/store/modules/platform/types";
import gecko_api from "@/gecko_api";



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
                    val.endTime = new Date(parseInt(val.endtime) * 1000);
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
                console.log(state.validatorsPending);

            });
        }
    },
    getters: {
        totalStakeAmount(state){
            let res = 0;

            state.validators.forEach(validator => {
                res += validator.stakeAmount
            });
            return res;
        }
    }
};

export default platform_module;
