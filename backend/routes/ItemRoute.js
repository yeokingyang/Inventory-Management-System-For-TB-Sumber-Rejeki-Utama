import express from "express";
import {
    getItems,
    getItemsById,
    createItems,
    updateItems,
    deleteItems,
    updateQuantityOnHand,
    countItems
} from "../controller/ItemController.js";
import { updateQuantitySold } from "../controller/OutgoingItemController.js";
import { updateQuantityReceived } from "../controller/IncomingItemController.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();
router.get('/items', verifyUser, getItems);
router.get('/items/:iuid', verifyUser, getItemsById);
router.get('/inventory/stat', verifyUser, countItems);
router.patch('/items/:iuid', verifyUser, adminOnly, updateItems);
router.patch('/updateQuantityOnHand', verifyUser, updateQuantityOnHand);
router.patch('/updateQuantitySold', verifyUser, updateQuantitySold);
router.patch('/updateQuantityReceived', verifyUser, updateQuantityReceived);
router.post('/items', verifyUser, adminOnly, createItems);
router.delete('/items/:iuid', verifyUser, adminOnly, deleteItems);


export default router;