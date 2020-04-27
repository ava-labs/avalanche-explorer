import {ApiTransaction} from "@/js/types";


export class Transaction{
    data: ApiTransaction;
    id: string;

    constructor(data: ApiTransaction) {
        this.data=data;
        this.id = data.id;

        console.log(data);
    }

    getInputAddresses(): string[]{
        let res: string[] = [];
        let inputs = this.data.inputs || [];


        inputs.forEach(input => {
            console.log(input)
           res.push(...input.output.addresses)
        });

        return res;
    }
}

