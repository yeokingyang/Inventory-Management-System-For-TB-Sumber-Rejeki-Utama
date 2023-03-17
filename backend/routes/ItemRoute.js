import express from "express";
import {
    getItems,
    getItemsById,
    createItems,
    updateItems,
    deleteItems,
    updateQuantityOnHand
} from "../controller/ItemController.js";

import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();
router.get('/items', verifyUser, getItems);
router.get('/items/:id', verifyUser, getItemsById);
router.patch('/items/:id', verifyUser, adminOnly, updateItems);
router.patch('/updateQuantityOnHand', verifyUser, updateQuantityOnHand);
router.post('/items', verifyUser, adminOnly, createItems);
router.delete('/items/:id', verifyUser, adminOnly, deleteItems);


export default router;