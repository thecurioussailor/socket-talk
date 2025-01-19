import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { deleteMessage, getAllMessages } from "../controllers/messageController";

export const messageRouter = Router();

messageRouter.get('/:chatId', authenticate, getAllMessages);
messageRouter.delete('/:messageId', authenticate, deleteMessage);