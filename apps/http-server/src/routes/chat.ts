import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { addParticipantToChat, createNewChat, deleteChatIfOwner, getChatDetailsAndMessages, getUserChat, removeParticipantFromChat, sendGroupChatInvite, updateChatDetails, updateParticipantRole } from "../controllers/chatController";
export const chatRouter = Router();

chatRouter.post('/', authenticate, createNewChat);
  
chatRouter.get('/', authenticate, getUserChat);

chatRouter.get('/:chatId', authenticate, getChatDetailsAndMessages);

chatRouter.put('/:chatId', authenticate, updateChatDetails);

chatRouter.delete('/:chatId', authenticate, deleteChatIfOwner);

chatRouter.post('/:chatId/participants', authenticate, addParticipantToChat);

chatRouter.put('/:chatId/participants/:userId', authenticate, updateParticipantRole);

chatRouter.delete('/:chatId/participants/:userId', authenticate, removeParticipantFromChat);

chatRouter.post('/:chatId/invites', authenticate, sendGroupChatInvite);

