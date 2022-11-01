import { pool } from "../db";
import { EntryCreateModel } from "../models/entry.model";
import { RecurrentTransaction } from "../models/recurrent.model";
import queue from "../queue";

export const getRecurrentTransactions = async (
  family: string,
  offset: number,
  limit: number
) => {
  const query = `SELECT *, COUNT(*) OVER() AS total FROM recurrent WHERE family = $1 ORDER BY id OFFSET $2 LIMIT $3`;
  const values = [family, offset, limit];
  const response = await pool.query(query, values);
  return response.rows;
};

export const createRecurrentTransaction = async (
  family: string,
  transaction: RecurrentTransaction
) => {
  try {
    const validCategories = await pool.query(
      `SELECT id FROM categories WHERE family = $1 AND status = $2`,
      [family, "ACTIVE"]
    );
    const validCategory = validCategories.rows.find(
      (category) => category.id === transaction.category
    );
    if (!validCategory) {
      throw { code: "23503" };
    }
    const query = `INSERT INTO recurrent (category, amount, description, "user", recurrence, family, send_date, type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;

    const values = [
      transaction.category,
      transaction.amount,
      transaction.description,
      transaction.user,
      transaction.recurrence,
      family,
      transaction.next_date,
      transaction.type,
    ];
    const response = await pool.query(query, values);
    return response.rows[0];
  } catch (err: any) {
    if (err.code === "23503") {
      throw err;
    }
    throw { status: 500, message: `Error creating recurrent transaction` };
  }
};

export const updateRecurrentTransaction = async (
  id: string,
  family: string,
  transaction: RecurrentTransaction
) => {
  const client = await pool.connect();
  try {
    const validCategories = await client.query(
      `SELECT id FROM categories WHERE family = $1 AND status = $2`,
      [family, "ACTIVE"]
    );
    const validCategory = validCategories.rows.find(
      (category) => category.id === transaction.category
    );
    if (!validCategory) {
      throw { code: "23503" };
    }
    const oldTransaction = await client.query(
      `SELECT * FROM recurrent WHERE id = $1 AND family = $2 FOR UPDATE`,
      [id, family]
    );
    if (oldTransaction.rows.length === 0) {
      throw { code: "22404" };
    }

    const query = `UPDATE recurrent SET category = $1, amount = $2, description = $3, "user" = $4, recurrence = $5, send_date = $6, type = $7 WHERE id = $8 AND family = $9 RETURNING *`;
      const values = [
      transaction.category,
      transaction.amount,
      transaction.description,
      transaction.user,
      transaction.recurrence,
      transaction.next_date,
      transaction.type,
      id,
      family,
    ];
    const response = await pool.query(query, values);

    client.query("COMMIT");

    return response.rows[0];
  } catch (err: any) {
    if (err.code === "23503") {
      throw err;
    }
    if (err.code === "22404") {
      throw err;
    }
    throw { status: 500, message: `Error updating recurrent transaction` };
  } finally {
    client.release();
  }
};

export const deleteRecurrentTransaction = async (
  id: string,
  family: string
) => {
  try {
    const oldTransaction = await pool.query(
      `SELECT * FROM recurrent WHERE id = $1 AND family = $2 FOR UPDATE`,
      [id, family]
    );
    if (oldTransaction.rows.length === 0) {
      throw { code: "22404" };
    }

    const query = `DELETE FROM recurrent WHERE id = $1 AND family = $2 RETURNING *`;
    const values = [id, family];
    const response = await pool.query(query, values);
    return response.rows[0];
  } catch (err: any) {
    if (err.code === "22404") {
      throw err;
    }
    throw { status: 500, message: `Error deleting recurrent transaction` };
  }
};

const getNextDate = (
  recurrence: "daily" | "weekly" | "monthly",
  date: Date
) => {
  switch (recurrence) {
    case "daily":
      return new Date(date.setDate(date.getDate() + 1));
    case "weekly":
      return new Date(date.setDate(date.getDate() + 7));
    case "monthly":
      return new Date(date.setMonth(date.getMonth() + 1));
  }
};

const sendDailyTransactions = async () => {
  while(true) {
    const client = await pool.connect();
    try {
      const query = `SELECT * FROM recurrent WHERE send_date <= NOW() ORDER BY send_date LIMIT 1 FOR UPDATE SKIP LOCKED`;
      const response = await client.query(query);
      if (response.rows.length === 0) {
        return;
      }
      const transaction = response.rows[0];
      const newTransaction:EntryCreateModel = {
        amount: transaction.amount,
        category: transaction.category,
        description: transaction.description,
        user: transaction.user,
        family: transaction.family,
        entryDate: new Date(),
        type: transaction.type
      };
      console.log(transaction.id, newTransaction);
      const nextDate = getNextDate(
        transaction.recurrence,
        transaction.send_date
      );
      const updateQuery = `UPDATE recurrent SET send_date = $1 WHERE id = $2 RETURNING *`;
      const updateValues = [nextDate, transaction.id];
      const updateResponse = await client.query(updateQuery, updateValues);
      await queue.createTransaction(newTransaction);
      client.query("COMMIT");
    } catch (err: any) {
      console.log(err);
      client.query("ROLLBACK");
    } finally {
      client.release();
    }
  }
};


  // 


export default {
  getRecurrentTransactions,
  createRecurrentTransaction,
  updateRecurrentTransaction,
  deleteRecurrentTransaction,
  sendDailyTransactions,
};

