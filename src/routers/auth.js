import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import {
  loginUserSchema,
  loginWithGoogleOAuthSchema,
  registerUserSchema,
} from '../validation/auth.js';
import {
  getGoogleOAuthUrlController,
  loginUserController,
  loginWithGoogleController,
  logoutUserController,
  refreshSessionController,
  registerUserController,
  resetPasswordController,
  sendResetPasswordEmailController,
} from '../controllers/auth.js';
import { sendResetPasswordValidationSchema } from '../validation/sendResetPasswordValidationSchema.js';
import { resetPasswordValidationSchema } from '../validation/resetPasswordValidationSchema.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

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

authRouter.get('/get-oauth-url', ctrlWrapper(getGoogleOAuthUrlController));
authRouter.post(
  '/confirm-oauth',
  validateBody(loginWithGoogleOAuthSchema),
  ctrlWrapper(loginWithGoogleController),
);

export default authRouter;
