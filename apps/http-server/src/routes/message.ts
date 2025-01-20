import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { deleteMessage} from "../controllers/messageController";

export const messageRouter = Router();

messageRouter.delete('/:messageId', authenticate, deleteMessage);