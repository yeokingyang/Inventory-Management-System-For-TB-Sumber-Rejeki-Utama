import express from "express";
import {
    getOutgoingItems,
    getOutgoingItemsById,
    createOutgoingItems,
    updateOutgoingItems,
    deleteOutgoingItems,
    getOutgoingItemsSumTotalCredit,
    getThisMonthIncome,
    getThisMonthVsLastMonthIncome,
    getIncomeChart,
    getIncometoForecast,
    getReportIncomebyDaily
} from "../controller/OutgoingItemController.js";

import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();
router.get('/outgoingItems/sumTotalCredit',verifyUser, getOutgoingItemsSumTotalCredit);
router.get('/outgoingItems/:id', verifyUser, getOutgoingItemsById);
router.get('/outgoingItems', verifyUser, getOutgoingItems);
router.get('/incomeThisMonth', verifyUser, getThisMonthIncome);
router.get('/incomeDifferences', verifyUser, getThisMonthVsLastMonthIncome);
router.get('/income', verifyUser, getIncomeChart);
router.get('/incomeForecast', verifyUser, getIncometoForecast);
router.get('/report/incomebyDaily', verifyUser, getReportIncomebyDaily);
router.post('/outgoingItems', verifyUser, createOutgoingItems);
router.patch('/outgoingItems/:id', verifyUser, adminOnly, updateOutgoingItems);
router.delete('/outgoingItems/:id', verifyUser, adminOnly, deleteOutgoingItems);


export default router;