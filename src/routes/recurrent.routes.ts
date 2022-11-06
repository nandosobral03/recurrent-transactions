import express from 'express';
import { getRecurrentTransactions, createRecurrentTransaction, updateRecurrentTransaction, deleteRecurrentTransaction } from '../controllers/recurrent.controller';
const router = express.Router();

router.get('/', getRecurrentTransactions);
router.post('/', createRecurrentTransaction);
router.put('/:id', updateRecurrentTransaction);
router.delete('/:id', deleteRecurrentTransaction);


export default router;