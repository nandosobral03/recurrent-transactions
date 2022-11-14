import { Request, Response } from "express";
import { isRegularExpressionLiteral } from "typescript";
import {
  getRecurrentTransactions,
  createRecurrentTransaction,
  deleteRecurrentTransaction,
  updateRecurrentTransaction,
} from "../../controllers/recurrent.controller";
import recurrentService from "../../services/recurrent";
jest.mock("../../services/recurrent");

describe("Recurrent Controller", () => {
  describe("Get Recurrent Transactions", () => {
    it("Should return 200 and a list of recurrent transactions", async () => {
      recurrentService.getRecurrentTransactions = jest
        .fn()
        .mockResolvedValueOnce({
          total: 0,
          offset: 0,
          limit: 5,
          transactions: [],
        });
      const req = { headers: { authorization: "" } } as Request;
      req.query = {
        limit: "10",
        offset: "0",
      };
      JSON.parse = jest.fn().mockReturnValue({ family: "Sobral" });
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as any as Response;
      await getRecurrentTransactions(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        total: 0,
        offset: 0,
        limit: 5,
        transactions: [],
      });
    }),
      it("Should return 500 and a message in case the error was caught by the service", async () => {
        recurrentService.getRecurrentTransactions = jest
          .fn()
          .mockRejectedValue({
            status: 500,
            message: "Error getting recurrent transactions",
          });
        const req = { headers: { authorization: "" } } as Request;
        req.query = {
          limit: "10",
          offset: "0",
        };
        JSON.parse = jest.fn().mockReturnValue({ family: "Sobral" });
        const res = {
          status: jest.fn().mockReturnThis(),
          send: jest.fn(),
        } as any as Response;
        await getRecurrentTransactions(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
          message: "Error getting recurrent transactions",
        });
      });
    it("Should return 500 and internal server error if the error was not caught", async () => {
      recurrentService.getRecurrentTransactions = jest
        .fn()
        .mockRejectedValue({});
      const req = { headers: { authorization: "" } } as Request;
      req.query = {
        limit: "10",
        offset: "0",
      };
      JSON.parse = jest.fn().mockReturnValue({ family: "Sobral" });
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as any as Response;
      await getRecurrentTransactions(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        message: "Internal server error",
      });
    });
  });
  describe("Create Recurrent Transaction", () => {
    it("Should return 201 and the created recurrent transaction", async () => {
      recurrentService.createRecurrentTransaction = jest
        .fn()
        .mockResolvedValueOnce({
          amount: 100,
          category: "Food",
          description: "Burger",
          user: "Sobral",
          recurrence: "weekly",
          next_date: "01/01/2050",
          type: "spending",
        });
      const req = { headers: { authorization: "" } } as Request;
      req.body = {
        amount: 100,
        category: "Food",
        description: "Burger",
        user: "Sobral",
        recurrence: "weekly",
        next_date: "01/01/2050",
        type: "spending",
      };
      JSON.parse = jest.fn().mockReturnValue({ family: "Sobral" });
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as any as Response;
      await createRecurrentTransaction(req, res);
      expect(res.send).toHaveBeenCalledWith({
        amount: 100,
        category: "Food",
        description: "Burger",
        user: "Sobral",
        recurrence: "weekly",
        next_date: "01/01/2050",
        type: "spending",
      });
      expect(res.status).toHaveBeenCalledWith(201);
    }),
      it("Should return 400 with invalid date format if the format is invalid", async () => {
        const req = { headers: { authorization: "" } } as Request;
        req.body = {
          name: "Test",
          value: 100,
          next_date: "2021-01-01",
          family: "Sobral",
          category: "Food",
          type: "Expense",
        };
        JSON.parse = jest.fn().mockReturnValue({ family: "Sobral" });
        const res = {
          status: jest.fn().mockReturnThis(),
          send: jest.fn(),
        } as any as Response;
        await createRecurrentTransaction(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
          message: "Invalid date format, format should be MM/DD/YYYY",
        });
      });
    it("Should return 400 with invalid date if the date should be in the future", async () => {
      const req = { headers: { authorization: "" } } as Request;
      req.body = {
        name: "Test",
        value: 100,
        next_date: "01/01/2000",
        family: "Sobral",
        category: "Food",
        type: "Expense",
      };
      JSON.parse = jest.fn().mockReturnValue({ family: "Sobral" });
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as any as Response;
      await createRecurrentTransaction(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        message: "Invalid date, date should be in the future",
      });
    });
    it("Should return 400 with invalid type if the type is not Expense or Income", async () => {
      const req = { headers: { authorization: "" } } as Request;
      req.body = {
        amount: 100,
        category: "Food",
        description: "Burger",
        user: "Sobral",
        recurrence: "weekly",
        next_date: "01/01/2050",
        type: "invalid",
      };
      JSON.parse = jest.fn().mockReturnValue({ family: "Sobral" });
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as any as Response;
      await createRecurrentTransaction(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        message: "Invalid request body",
      });
    });
    it("Should return the status and message sent by the service if its an HttpError", async () => {
      recurrentService.createRecurrentTransaction = jest
        .fn()
        .mockRejectedValueOnce({ status: 405, message: "Invalid category" });
      const req = { headers: { authorization: "" } } as Request;
      req.body = {
        amount: 100,
        category: "Food",
        description: "Burger",
        user: "Sobral",
        recurrence: "weekly",
        next_date: "01/01/2050",
        type: "spending",
      };
      JSON.parse = jest.fn().mockReturnValue({ family: "Sobral" });
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as any as Response;
      await createRecurrentTransaction(req, res);
      expect(res.status).toHaveBeenCalledWith(405);
      expect(res.send).toHaveBeenCalledWith({
        message: "Invalid category",
      });
    });
    it("Should return 500 if the service throws an unkown error", async () => {
      recurrentService.createRecurrentTransaction = jest
        .fn()
        .mockRejectedValueOnce(new Error("Unknown error"));
      const req = { headers: { authorization: "" } } as Request;
      req.body = {
        amount: 100,
        category: "Food",
        description: "Burger",
        user: "Sobral",
        recurrence: "weekly",
        next_date: "01/01/2050",
        type: "spending",
      };
      JSON.parse = jest.fn().mockReturnValue({ family: "Sobral" });
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as any as Response;
      await createRecurrentTransaction(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        message: "Internal server error",
      });
    });
  });
  describe("Update Recurrent Transaction", () => {
    it("Should return 200 and the updated recurrent transaction", async () => {
      recurrentService.updateRecurrentTransaction = jest
        .fn()
        .mockResolvedValueOnce({
          amount: 100,
          category: "Food",
          description: "Burger",
          user: "Sobral",
          recurrence: "weekly",
          next_date: "01/01/2050",
          type: "spending",
        });
      const req = { headers: { authorization: "" } } as Request;
      req.params = { id: "1" };
      req.body = {
        amount: 100,
        category: "Food",
        description: "Burger",
        user: "Sobral",
        recurrence: "weekly",
        next_date: "01/01/2050",
        type: "spending",
      };
      JSON.parse = jest.fn().mockReturnValue({ family: "Sobral" });
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as any as Response;
      await updateRecurrentTransaction(req, res);
      expect(res.send).toHaveBeenCalledWith({
        amount: 100,
        category: "Food",
        description: "Burger",
        user: "Sobral",
        recurrence: "weekly",
        next_date: "01/01/2050",
        type: "spending",
      });
      expect(res.status).toHaveBeenCalledWith(200);
    }),
      it("Should return 400 with invalid date format if the format is invalid", async () => {
        const req = { headers: { authorization: "" } } as Request;
        req.params = { id: "1" };

        req.body = {
          name: "Test",
          value: 100,
          next_date: "2021-01-01",
          family: "Sobral",
          category: "Food",
          type: "Expense",
        };
        JSON.parse = jest.fn().mockReturnValue({ family: "Sobral" });
        const res = {
          status: jest.fn().mockReturnThis(),
          send: jest.fn(),
        } as any as Response;
        await updateRecurrentTransaction(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
          message: "Invalid date format, format should be MM/DD/YYYY",
        });
      });
    it("Should return 400 with invalid date if the date should be in the future", async () => {
      const req = { headers: { authorization: "" } } as Request;
      req.params = { id: "1" };

      req.body = {
        name: "Test",
        value: 100,
        next_date: "01/01/2000",
        family: "Sobral",
        category: "Food",
        type: "Expense",
      };
      JSON.parse = jest.fn().mockReturnValue({ family: "Sobral" });
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as any as Response;
      await updateRecurrentTransaction(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        message: "Invalid date, date should be in the future",
      });
    });
    it("Should return 400 with invalid type if the type is not Expense or Income", async () => {
      const req = { headers: { authorization: "" } } as Request;
      req.params = { id: "1" };
      req.body = {
        amount: 100,
        category: "Food",
        description: "Burger",
        user: "Sobral",
        recurrence: "weekly",
        next_date: "01/01/2050",
        type: "invalid",
      };
      JSON.parse = jest.fn().mockReturnValue({ family: "Sobral" });
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as any as Response;
      await updateRecurrentTransaction(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        message: "Invalid request body",
      });
    });
    it("Should return the status and message sent by the service if its an HttpError", async () => {
      recurrentService.updateRecurrentTransaction = jest
        .fn()
        .mockRejectedValueOnce({ status: 405, message: "Invalid category" });
      const req = { headers: { authorization: "" } } as Request;
      req.params = { id: "1" };
      req.body = {
        amount: 100,
        category: "Food",
        description: "Burger",
        user: "Sobral",
        recurrence: "weekly",
        next_date: "01/01/2050",
        type: "spending",
      };
      JSON.parse = jest.fn().mockReturnValue({ family: "Sobral" });
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as any as Response;
      await updateRecurrentTransaction(req, res);
      expect(res.status).toHaveBeenCalledWith(405);
      expect(res.send).toHaveBeenCalledWith({
        message: "Invalid category",
      });
    });
    it("Should return 500 if the service throws an unkown error", async () => {
      recurrentService.updateRecurrentTransaction = jest
        .fn()
        .mockRejectedValueOnce(new Error("Unknown error"));
      const req = { headers: { authorization: "" } } as Request;
      req.params = { id: "1" };
      req.body = {
        amount: 100,
        category: "Food",
        description: "Burger",
        user: "Sobral",
        recurrence: "weekly",
        next_date: "01/01/2050",
        type: "spending",
      };
      JSON.parse = jest.fn().mockReturnValue({ family: "Sobral" });
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as any as Response;
      await updateRecurrentTransaction(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        message: "Internal server error",
      });
    });
  });
  describe("Delete Recurrent Transaction", () => {
    it("Should return 200 with the deleted transaction", async () => {
      recurrentService.deleteRecurrentTransaction = jest
        .fn()
        .mockResolvedValueOnce({
          amount: 100,
          category: "Food",
          description: "Burger",
          user: "Sobral",
          recurrence: "weekly",
          next_date: "01/01/2050",
          type: "spending",
        });
      const req = { headers: { authorization: "" } } as Request;
      req.params = { id: "1" };
      JSON.parse = jest.fn().mockReturnValue({ family: "Sobral" });
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as any as Response;
      await deleteRecurrentTransaction(req, res);
      expect(res.send).toHaveBeenCalledWith({
        amount: 100,
        category: "Food",
        description: "Burger",
        user: "Sobral",
        recurrence: "weekly",
        next_date: "01/01/2050",
        type: "spending",
      });
      expect(res.status).toHaveBeenCalledWith(200);
    }),
      it("Should return the status and message sent by the service if its an HttpError", async () => {
        recurrentService.deleteRecurrentTransaction = jest
          .fn()
          .mockRejectedValueOnce({ status: 405, message: "Invalid deletion" });
        const req = { headers: { authorization: "" } } as Request;
        req.params = { id: "1" };
        JSON.parse = jest.fn().mockReturnValue({ family: "Sobral" });
        const res = {
          status: jest.fn().mockReturnThis(),
          send: jest.fn(),
        } as any as Response;
        await deleteRecurrentTransaction(req, res);
        expect(res.status).toHaveBeenCalledWith(405);
        expect(res.send).toHaveBeenCalledWith({
          message: "Invalid deletion",
        });
      }),
      it("Should return 500 if the service throws an unkown error", async () => {
        recurrentService.deleteRecurrentTransaction = jest
          .fn()
          .mockRejectedValueOnce(new Error("Unknown error"));
        const req = { headers: { authorization: "" } } as Request;
        req.params = { id: "1" };
        JSON.parse = jest.fn().mockReturnValue({ family: "Sobral" });
        const res = {
          status: jest.fn().mockReturnThis(),
          send: jest.fn(),
        } as any as Response;
        await deleteRecurrentTransaction(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
          message: "Internal server error",
        });
      });
  });
});
