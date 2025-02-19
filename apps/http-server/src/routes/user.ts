import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { getUserProfile, getUserProfileById, getUserProfileByUsername, resetPassword, updateUserProfile } from "../controllers/userController";
const userRouter = Router();

// Get current user's profile
userRouter.get('/profile', authenticate, getUserProfile);
userRouter.put('/profile', authenticate, updateUserProfile);
userRouter.put('/reset-password', authenticate, resetPassword);
// Get user profile by ID
userRouter.get('/:userId', authenticate, getUserProfileById);

userRouter.get('/search/:username', authenticate, getUserProfileByUsername);
  

export default userRouter;
