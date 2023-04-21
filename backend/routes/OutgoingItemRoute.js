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
router.get('/outgoingItems/sumTotalCredit',verifyUser, adminOnly, getOutgoingItemsSumTotalCredit);
router.get('/outgoingItems/:id', verifyUser, getOutgoingItemsById);
router.get('/outgoingItems', verifyUser, getOutgoingItems);
router.get('/incomeThisMonth', verifyUser, adminOnly, getThisMonthIncome);
router.get('/incomeDifferences', verifyUser,adminOnly, getThisMonthVsLastMonthIncome);
router.get('/income', verifyUser, adminOnly, getIncomeChart);
router.get('/incomePrevious', verifyUser, adminOnly, getPrevIncome);
router.get('/report/incomebyDaily', verifyUser, adminOnly, getReportIncomebyDaily);
router.get('/report/salesbyDaily', verifyUser, adminOnly, getReportSalesbyDaily);
router.get('/report/itemSalesbyDaily', verifyUser, adminOnly, getReportItemSalesbyDaily);
router.post('/outgoingItems', verifyUser, createOutgoingItems);
router.patch('/outgoingItems/:id', verifyUser, adminOnly, updateOutgoingItems);
router.delete('/outgoingItems/:id', verifyUser, adminOnly, deleteOutgoingItems);


export default router;