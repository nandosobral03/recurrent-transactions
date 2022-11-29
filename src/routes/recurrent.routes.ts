import express from 'express';
import { getRecurrentTransactions, createRecurrentTransaction, updateRecurrentTransaction, deleteRecurrentTransaction } from '../controllers/recurrent.controller';
import * as authorization from '../middlewares/authorization.middleware';
const router = express.Router();


router.get('/', authorization.permit(['ADMIN','USER']), getRecurrentTransactions);
router.use('/', authorization.permit(['ADMIN']));
router.post('/', createRecurrentTransaction);
router.put('/:id', updateRecurrentTransaction);
router.delete('/:id', deleteRecurrentTransaction);


export default router;