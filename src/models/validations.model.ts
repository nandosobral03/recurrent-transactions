import { validateValue } from "../services/validations";
import { RecurrentTransaction } from "./recurrent.model";

export interface Validation{
    field: string;
    result: boolean;
    errorMsg: string;
}

export const validateRecurrentTransactionModel = (data: RecurrentTransaction) => {
    const error = {
        status: 400,
        message: {},
    } as any;
    const validations: Validation[] = [
        validateValue({ min: 1 }, "Amount", data.amount),
    ]
    for (let validation of validations) {
        if (!validation.result) {
            error.message[validation.field] = validation.errorMsg;
        }
    }
    if (validations.some(validation => !validation.result)) throw error;
}