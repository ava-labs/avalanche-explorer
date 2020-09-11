import { ITransaction, ITransactionData, ITransactionInputData, ITransactionInput, ITransactionOutput, ITransactionOutputData } from "@/js/ITransaction";
import { stringToBig } from '@/helper';

function getOutput(output: ITransactionOutputData): ITransactionOutput {
    return {
        addresses: output.addresses,
        amount: stringToBig(output.amount), // TODO: this Big conversion is not denominated bc of dependency on asset lookup
        assetID: output.assetID,
        id: output.id,
        locktime: output.locktime,
        outputIndex: output.outputIndex,
        outputType: output.outputType,
        redeemingTransactionID: output.redeemingTransactionID,
        threshold: output.threshold,
        timestamp: new Date(output.timestamp),
        transactionID: output.transactionID
    }
}

export class Transaction implements ITransaction {
    id: string;
    inputs: ITransactionInput[];
    outputs: ITransactionOutput[];
    timestamp: string;
    type: string;
    chainID: string;
    memo: string;

    constructor(data: ITransactionData) {
        this.inputs = (data.inputs === null || data.inputs.length === 0)
            ? [] 
            : data.inputs.map((input: ITransactionInputData) => {
                return {
                    credentials: input.credentials,
                    output: getOutput(input.output)
                };
            });
        this.outputs = (data.outputs === null || data.outputs.length === 0) 
            ? [] 
            : data.outputs.map((output: ITransactionOutputData) => getOutput(output));
        this.id = data.id;
        this.timestamp = data.timestamp;
        this.type = data.type;
        this.chainID = data.chainID;
        this.id = data.id;
        this.memo = data.memo;
    }

    getInputAddresses(): string[] {
        let res: string[] = [];
        let inputs = this.inputs || [];

        inputs.forEach(input => {
            res.push(...input.output.addresses)
        });

        return res;
    }
}
