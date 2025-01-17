import { Router } from "express"
import { authenticate } from "../middleware/authenticate";
import { respondToInvite, userGroupInvites } from "../controllers/inviteController";

const inviteRouter = Router();

inviteRouter.get('/' ,authenticate, userGroupInvites);
inviteRouter.put('/:inviteId', authenticate, respondToInvite);

export default inviteRouter;
