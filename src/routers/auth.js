import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { loginUserSchema, registerUserSchema } from '../validation/auth.js';
import {
  loginUserController,
  logoutUserController,
  refreshSessionController,
  registerUserController,
  resetPasswordController,
  sendResetPasswordEmailController,
} from '../controllers/auth.js';
import { sendResetPasswordValidationSchema } from '../validation/sendResetPasswordValidationSchema.js';
import { resetPasswordValidationSchema } from '../validation/resetPasswordValidationSchema.js';

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(registerUserSchema),
  registerUserController,
);
authRouter.post('/login', validateBody(loginUserSchema), loginUserController);
authRouter.post('/logout', logoutUserController);
authRouter.post('/refresh', refreshSessionController);
authRouter.post(
  '/send-reset-email',
  validateBody(sendResetPasswordValidationSchema),
  sendResetPasswordEmailController,
);
authRouter.post(
  '/reset-password',
  validateBody(resetPasswordValidationSchema),
  resetPasswordController,
);

export default authRouter;
