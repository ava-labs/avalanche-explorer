import { ITransaction, ITransactionData, ITransactionInputData, ITransactionInput, ITransactionOutput, ITransactionOutputData } from "@/js/ITransaction";
import { stringToBig } from '@/helper';

function getOutput(output: ITransactionOutputData): ITransactionOutput {
    return {
        addresses: output.addresses,
        amount: stringToBig(output.amount),
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
    unsignedTx: {
        networkID: number,
        blockchainID: string
    };
    inputs: ITransactionInput[];
    outputs: ITransactionOutput[];
    timestamp: string;
    type: string;
    chainID: string;

    constructor(data: ITransactionData) {
        this.unsignedTx = data.unsignedTx;
        this.inputs = data.inputs.map((input: ITransactionInputData) => {
            return {
                credentials: input.credentials,
                output: getOutput(input.output)
            }
        });
        this.outputs = data.outputs.map((output: ITransactionOutputData) => {
            return getOutput(output);
        });
        this.id = data.id;
        this.timestamp = data.timestamp;
        this.type = data.type;
        this.chainID = data.chainID;
        this.id = data.id;
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
