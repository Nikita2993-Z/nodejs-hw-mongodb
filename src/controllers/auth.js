import createHttpError from 'http-errors';
import { THIRTY_DAYS } from '../constants/index.js';
import {
  loginUser,
  logoutUser,
  refreshUsersSession,
  registerUser,
  resetPassword,
  sendResetPasswordEmail,
} from '../services/auth.js';

const setupSession = (session, res) => {
  res.cookie('refreshToken', session.refreshToken, {
    expires: new Date(Date.now() + THIRTY_DAYS),
    httpOnly: true,
  });
  res.cookie('sessionId', session._id, {
    expires: new Date(Date.now() + THIRTY_DAYS),
    httpOnly: true,
  });
};

export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);

  setupSession(session, res);

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const refreshSessionController = async (req, res, next) => {
  const { sessionId, refreshToken } = req.cookies || {};

  if (!sessionId || !refreshToken) {
    return next(createHttpError(401, 'No refresh credentials'));
  }
  const session = await refreshUsersSession({ sessionId, refreshToken });
  if (!session) {
    return next(createHttpError(401, 'Session not found'));
  }

  setupSession(session, res);

  res.json({
    status: 200,
    message: 'Successfully refreshed session!',
    data: { accessToken: session.accessToken },
  });
};

export const logoutUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies?.sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};

export const sendResetPasswordEmailController = async (req, res) => {
  await sendResetPasswordEmail(req.body.email);

  res.json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body.token, req.body.password);

  res.json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
};
