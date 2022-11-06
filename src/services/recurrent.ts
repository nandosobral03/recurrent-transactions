import { RecurrentTransaction } from "../models/recurrent.model";
import { validateRecurrentTransactionModel } from "../models/validations.model";
import recurrentRepository from "../repositories/recurrent.repository";


export const getRecurrentTransactions = async (family: string, offset: string, limit: string) => {
    const offsetNum = offset ? parseInt(offset) : 0;
    const limitNum = limit ? parseInt(limit) : 5;
    try{
        const transactions = await recurrentRepository.getRecurrentTransactions(family, offsetNum, limitNum);
        let total = transactions.length > 0 ? parseInt((transactions[0] as unknown as {total:string}).total) : 0;
        const response = {
            total: total,
            offset: offsetNum,
            limit: limitNum,
            transactions: transactions
        }
        return response;
    }
    catch(err){
        throw { status: 500, message: "Error getting recurrent transactions" };
    }

}

export const createRecurrentTransaction = async (family: string, transaction: RecurrentTransaction) => {
    validateRecurrentTransactionModel(transaction); // throws if invalid
    try{
        const result = await recurrentRepository.createRecurrentTransaction(family, transaction);
        return result;
    }
    catch(err:any){
        if (err?.code === '23503') {
            throw { status: 404, message: 'Category not found' };
        }
        throw { status: 500, message: "Error creating recurrent transaction" };
    }
}

export const updateRecurrentTransaction = async (id:string, family: string, transaction: RecurrentTransaction) => {
    validateRecurrentTransactionModel(transaction); // throws if invalid
    try{
        const result = await recurrentRepository.updateRecurrentTransaction(id, family, transaction);
        return result;
    }
    catch(err:any){
        if (err?.code === '22404') {
            throw { status: 404, message: 'Recurrent transaction not found' };
        }
        if (err?.code === '23503') {
            throw { status: 404, message: 'Category not found' };
        }
        throw { status: 500, message: "Error updating recurrent transaction" };
    }
}

export const deleteRecurrentTransaction = async (id:string, family: string) => {
    try{
        const result = await recurrentRepository.deleteRecurrentTransaction(id, family);
        return result;
    }
    catch(err:any){
        if (err?.code === '22404') {
            throw { status: 404, message: 'Recurrent transaction not found' };
        }
        throw { status: 500, message: "Error deleting recurrent transaction" };
    }
}


export default { 
    getRecurrentTransactions,
    createRecurrentTransaction,
    updateRecurrentTransaction,
    deleteRecurrentTransaction
}