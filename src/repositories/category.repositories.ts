import { pool } from "../db";


const createCategory = async (id: string, family: string) => {
    const query = `INSERT INTO categories (id, family, status) VALUES ($1, $2, $3) RETURNING *`;
    const result = await pool.query(query, [id, family, 'ACTIVE']);
    return result.rows[0];
}

const deleteCategory = async (id: string, family: string) => {
    const query = `UPDATE categories SET status = $1 WHERE id = $2 AND family = $3 RETURNING *`;
    const result = await pool.query(query, ['DELETED', id, family]);
    return result.rows[0];
}




export default {
    createCategory,
    deleteCategory
}