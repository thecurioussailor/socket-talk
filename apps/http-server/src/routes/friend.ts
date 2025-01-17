import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { prismaClient } from "@repo/prisma/client";
import { getAllFriendRequests, getUsersFriendList, removeFriend, respondToFriendRequest, sendFriendRequest } from "../controllers/friendController";

const friendRouter = Router();

friendRouter.get('/', authenticate, getUsersFriendList);
  
friendRouter.post('/requests/send/:userId', authenticate, sendFriendRequest);

friendRouter.get('/requests', authenticate, getAllFriendRequests);

friendRouter.put('/requests/:requestId', authenticate, respondToFriendRequest);

friendRouter.delete('/:friendId', authenticate,removeFriend);

export default friendRouter;