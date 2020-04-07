import {ApiTransaction} from "@/js/types";


export class Transaction{
    data: ApiTransaction;

    constructor(data:ApiTransaction) {
        this.data=data;
    }
}

