import express from "express";
import {
    getIncomingItems,
    getIncomingItemsById,
    createIncomingItems,
    updateIncomingItems,
    deleteIncomingItems,
    getExpenseChart,
    getThisMonthExpense,
    getReportExpensebyDaily
} from "../controller/IncomingItemController.js";

import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();
router.get('/incomingItems', verifyUser, getIncomingItems);
router.get('/incomingItems/:id', verifyUser, getIncomingItemsById);
router.get('/expense', verifyUser, adminOnly, getExpenseChart);
router.get('/expenseThisMonth', verifyUser, adminOnly, getThisMonthExpense);
router.get('/report/expensebyDaily', verifyUser, adminOnly, getReportExpensebyDaily);
router.post('/incomingItems', verifyUser, createIncomingItems);
router.patch('/incomingItems/:id', verifyUser, adminOnly, updateIncomingItems);
router.delete('/incomingItems/:id', verifyUser, adminOnly, deleteIncomingItems);

export default router;