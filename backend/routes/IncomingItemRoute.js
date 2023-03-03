import express from "express";
import {
    getIncomingItems,
    getIncomingItemsById,
    createIncomingItems,

} from "../controller/IncomingItemController.js";

import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();
router.get('/incomingItems', verifyUser, getIncomingItems);
router.get('/incomingItems/:id', verifyUser, getIncomingItemsById);
router.post('/incomingItems', verifyUser, createIncomingItems);

export default router;