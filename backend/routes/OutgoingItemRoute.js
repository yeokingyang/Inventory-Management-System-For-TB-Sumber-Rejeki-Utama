import express from "express";
import {
    getOutgoingItems,
    getOutgoingItemsById,
    createOutgoingItems,
    updateOutgoingItems,
    deleteOutgoingItems
} from "../controller/OutgoingItemController.js";

import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();
router.get('/outgoingItems', verifyUser, getOutgoingItems);
router.get('/outgoingItems/:id', verifyUser, getOutgoingItemsById);
router.post('/outgoingItems', verifyUser, createOutgoingItems);
router.patch('/outgoingItems/:id', verifyUser, adminOnly, updateOutgoingItems);
router.delete('/outgoingItems/:id', verifyUser, adminOnly, deleteOutgoingItems);

export default router;