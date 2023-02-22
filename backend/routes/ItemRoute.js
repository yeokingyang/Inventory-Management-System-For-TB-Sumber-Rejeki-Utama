import express from "express";
import {
    getItems,
    getItemsById,
    createItems,
    updateItems,
    deleteItems
} from "../controller/ItemController.js";


const router = express.Router();
router.get('/items', getItems);
router.get('/items/:id', getItemsById);
router.post('/items', createItems);
router.patch('/items/:id', updateItems);
router.delete('/items/:id', deleteItems);

export default router;