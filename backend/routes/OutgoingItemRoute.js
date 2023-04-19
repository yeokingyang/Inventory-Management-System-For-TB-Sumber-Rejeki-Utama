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
    getPrevIncome,
    getReportIncomebyDaily,
    getReportSalesbyDaily,
    getReportItemSalesbyDaily
} from "../controller/OutgoingItemController.js";

import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();
router.get('/outgoingItems/sumTotalCredit',verifyUser, getOutgoingItemsSumTotalCredit);
router.get('/outgoingItems/:id', verifyUser, getOutgoingItemsById);
router.get('/outgoingItems', verifyUser, getOutgoingItems);
router.get('/incomeThisMonth', verifyUser, getThisMonthIncome);
router.get('/incomeDifferences', verifyUser, getThisMonthVsLastMonthIncome);
router.get('/income', verifyUser, getIncomeChart);
router.get('/incomePrevious', verifyUser, getPrevIncome);
router.get('/report/incomebyDaily', verifyUser, getReportIncomebyDaily);
router.get('/report/salesbyDaily', verifyUser, getReportSalesbyDaily);
router.get('/report/itemSalesbyDaily', verifyUser, getReportItemSalesbyDaily);
router.post('/outgoingItems', verifyUser, createOutgoingItems);
router.patch('/outgoingItems/:id', verifyUser, adminOnly, updateOutgoingItems);
router.delete('/outgoingItems/:id', verifyUser, adminOnly, deleteOutgoingItems);


export default router;