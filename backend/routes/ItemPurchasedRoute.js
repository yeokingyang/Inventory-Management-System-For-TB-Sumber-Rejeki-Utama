import express from "express";
import {
    getItemsPurchased,
    getItemsPurchasedById,
    createItemsPurchased
} from "../controller/ItemPurchasedController.js";

import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();
router.get('/itemsPurchased', verifyUser, getItemsPurchased);
router.get('/getItemsPurchasedById/:id', verifyUser, getItemsPurchasedById);
router.post('/itemsPurchased', verifyUser, createItemsPurchased);

export default router;