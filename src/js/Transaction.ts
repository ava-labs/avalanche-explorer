import { ITransactionData } from "@/js/ITransaction";

export class Transaction {
    data: ITransactionData;
    id: string;

    constructor(data: ITransactionData) {
        this.data = data;
        this.id = data.id;
    }

    getInputAddresses(): string[] {
        let res: string[] = [];
        let inputs = this.data.inputs || [];

        inputs.forEach(input => {
            res.push(...input.output.addresses)
        });

        return res;
    }
}
