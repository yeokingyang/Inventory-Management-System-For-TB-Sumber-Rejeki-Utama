import express from "express";
import {
    getWishlistItems,
    getWishlistItemsById,
    createWishlistItems,
    updateWishlistItems,
    deleteWishlistItems
} from "../controller/WishlistItemController.js";

import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();
router.get('/wishlistitems', verifyUser, getWishlistItems);
router.get('/wishlistitems/:id', verifyUser, getWishlistItemsById);
router.patch('/wishlistitems/:id', verifyUser, adminOnly, updateWishlistItems);
router.post('/wishlistitems', verifyUser, adminOnly, createWishlistItems);
router.delete('/wishlistitems/:id', verifyUser, adminOnly, deleteWishlistItems);


export default router;