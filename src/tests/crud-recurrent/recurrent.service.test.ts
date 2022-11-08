import {getRecurrentTransactions,createRecurrentTransaction,updateRecurrentTransaction, deleteRecurrentTransaction} from '../../services/recurrent';
import recurrentRepository from '../../repositories/recurrent.repository';
jest.mock("../../repositories/recurrent.repository")

describe("Recurrent Service", () => {
    describe("Get Recurrent Transactions", () => {
        it("Should return a list of recurrent transactions with a total, offset and limit", async () => {
            recurrentRepository.getRecurrentTransactions = jest.fn().mockResolvedValue([
                {id: 1, description: "test", amount: 100, category: 1, family: 1, total: "2"},
                {id: 1, description: "test", amount: 100, category: 1, family: 1, total: "2"},
            ]);
            const result = await getRecurrentTransactions("1", "0", "5");
            expect(result).toEqual({
                total: 2,
                offset: 0,
                limit: 5,
                transactions: [
                    {id: 1, description: "test", amount: 100, category: 1, family: 1},
                    {id: 1, description: "test", amount: 100, category: 1, family: 1},
                ]
            });}),
        it("Should return a list of recurrent transactions with a total equal 0 if there are none, offset and limit", async () => {
            recurrentRepository.getRecurrentTransactions = jest.fn().mockResolvedValue([]);
            const result = await getRecurrentTransactions("1", "0", "5");
            expect(result).toEqual({
                total: 0,
                offset: 0,
                limit: 5,
                transactions: []
            });
        }),
        it("Should return a list of recurrent transactions with a total offset equal zero and limit 5 if none are provided", async () => {
            recurrentRepository.getRecurrentTransactions = jest.fn().mockResolvedValue([
                {id: 1, description: "test", amount: 100, category: 1, family: 1, total: "2"},
                {id: 1, description: "test", amount: 100, category: 1, family: 1, total: "2"},
            ]);
            const result = await getRecurrentTransactions("1","","");
            expect(result).toEqual({
                total: 2,
                offset: 0,
                limit: 5,
                transactions: [
                    {id: 1, description: "test", amount: 100, category: 1, family: 1},
                    {id: 1, description: "test", amount: 100, category: 1, family: 1},
                ]
            });
        });
        it("Should throw and error with status 500 if there is an error getting recurrent transactions", async () => {
            recurrentRepository.getRecurrentTransactions = jest.fn().mockRejectedValue(new Error("Error getting recurrent transactions"));
            await expect(getRecurrentTransactions("1","","")).rejects.toEqual({status: 500, message: "Error getting recurrent transactions"});
        })
    })
    describe("Create Recurrent Transaction", () => {
        it("Should create a recurrent transaction", async () => {
            recurrentRepository.createRecurrentTransaction = jest.fn().mockResolvedValue({id: 1, description: "test", amount: 100, category: 1, family: 1});
            const result = await createRecurrentTransaction("1", {
                description: "test", amount: 100, category: "1", recurrence: "weekly", next_date: new Date(), type: "income",
                user: 'user'
            });
            expect(result).toEqual({id: 1, description: "test", amount: 100, category: 1, family: 1});
        });
        it("Should throw error if amount is less than zero", async () => {
            await expect(createRecurrentTransaction("1", {
                description: "test", amount: -100, category: "1", recurrence: "weekly", next_date: new Date(), type: "income",
                user: 'user'
            })).rejects.toEqual({status: 400, message: {Amount: "Amount must be at least 1"}});
        });
        it("Should throw 404 if category does not exist", async () => {
            recurrentRepository.createRecurrentTransaction = jest.fn().mockRejectedValue({code: '23503'});
            await expect(createRecurrentTransaction("1", {
                description: "test", amount: 100, category: "1", recurrence: "weekly", next_date: new Date(), type: "income",
                user: 'user'
            })).rejects.toEqual({status: 404, message: "Category not found"});
        });
        it("Should throw 500 if there is an error creating recurrent transaction", async () => {
            recurrentRepository.createRecurrentTransaction = jest.fn().mockRejectedValue(new Error("Error creating recurrent transaction"));
            await expect(createRecurrentTransaction("1", {
                description: "test", amount: 100, category: "1", recurrence: "weekly", next_date: new Date(), type: "income",
                user: 'user'
            })).rejects.toEqual({status: 500, message: "Error creating recurrent transaction"});
        });
    })
    describe("Update Recurrent Transaction", () => {
        it("Should update a recurrent transaction", async () => {
            recurrentRepository.updateRecurrentTransaction = jest.fn().mockResolvedValue({id: 1, description: "test", amount: 100, category: 1, family: 1});
            const result = await updateRecurrentTransaction("1", "1", {
                description: "test", amount: 100, category: "1", recurrence: "weekly", next_date: new Date(), type: "income",
                user: 'user'
            });
            expect(result).toEqual({id: 1, description: "test", amount: 100, category: 1, family: 1});
        });
        it("Should throw error if amount is less than zero", async () => {
            await expect(updateRecurrentTransaction("1", "1", {
                description: "test", amount: -100, category: "1", recurrence: "weekly", next_date: new Date(), type: "income",
                user: 'user'
            })).rejects.toEqual({status: 400, message: {Amount: "Amount must be at least 1"}});
        });
        it("Should throw 404 if category does not exist", async () => {
            recurrentRepository.updateRecurrentTransaction = jest.fn().mockRejectedValue({code: '23503'});
            await expect(updateRecurrentTransaction("1", "1", {
                description: "test", amount: 100, category: "1", recurrence: "weekly", next_date: new Date(), type: "income",
                user: 'user'
            })).rejects.toEqual({status: 404, message: "Category not found"});
        });
        it("Should throw 404 if recurrent transaction does not exist", async () => {
            recurrentRepository.updateRecurrentTransaction = jest.fn().mockRejectedValue({code: '22404'});
            await expect(updateRecurrentTransaction("1", "1", {
                description: "test", amount: 100, category: "1", recurrence: "weekly", next_date: new Date(), type: "income",
                user: 'user'
            })).rejects.toEqual({status: 404, message: "Recurrent transaction not found"});
        });
        it("Should throw 500 if there is an error updating recurrent transaction", async () => {
            recurrentRepository.updateRecurrentTransaction = jest.fn().mockRejectedValue(new Error("Error updating recurrent transaction"));
            await expect(updateRecurrentTransaction("1", "1", {
                description: "test", amount: 100, category: "1", recurrence: "weekly", next_date: new Date(), type: "income",
                user: 'user'
            })).rejects.toEqual({status: 500, message: "Error updating recurrent transaction"});
        });
    });
    describe("Delete Recurrent Transaction", () => {
        it("Should delete a recurrent transaction", async () => {
            recurrentRepository.deleteRecurrentTransaction = jest.fn().mockResolvedValue({id: 1, description: "test", amount: 100, category: 1, family: 1});
            const result = await deleteRecurrentTransaction("1", "1");
            expect(result).toEqual({id: 1, description: "test", amount: 100, category: 1, family: 1});
        });
        it("Should throw 404 if recurrent transaction does not exist", async () => {
            recurrentRepository.deleteRecurrentTransaction = jest.fn().mockRejectedValue({code: '22404'});
            await expect(deleteRecurrentTransaction("1", "1")).rejects.toEqual({status: 404, message: "Recurrent transaction not found"});
        });
        it("Should throw 500 if there is an error deleting recurrent transaction", async () => {
            recurrentRepository.deleteRecurrentTransaction = jest.fn().mockRejectedValue(new Error("Error deleting recurrent transaction"));
            await expect(deleteRecurrentTransaction("1", "1")).rejects.toEqual({status: 500, message: "Error deleting recurrent transaction"});
        });
    });
}); 