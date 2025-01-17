import { Router } from "express";
import userRouter from "./user";
import { chatRouter } from "./chat";
import friendRouter from "./friend";
import authRouter from "./auth";
import inviteRouter from "./invite";

const router = Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/friends', friendRouter);
router.use('/chats', chatRouter);
router.use('/invites', inviteRouter);


export default router