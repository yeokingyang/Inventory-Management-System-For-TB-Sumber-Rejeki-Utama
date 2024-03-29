import express from "express";
import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    countStaffs
} from "../controller/UserController.js";

import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();
router.get('/users', verifyUser, adminOnly, getUsers);
router.get('/users/:uuid', verifyUser, adminOnly, getUserById);
router.get('/staffs/count', verifyUser, adminOnly, countStaffs);
router.post('/users', verifyUser, adminOnly, createUser);
router.patch('/users/:uuid', verifyUser, adminOnly, updateUser);
router.delete('/users/:uuid', verifyUser, adminOnly, deleteUser);

export default router;