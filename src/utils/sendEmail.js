import nodemailer from 'nodemailer';
import { getEnvVar } from './getEnvVar.js';
import { ENV_VARS } from '../constants/envVars.js';
import createHttpError from 'http-errors';

const transport = nodemailer.createTransport({
  port: Number(getEnvVar(ENV_VARS.SMTP_PORT)),
  host: getEnvVar(ENV_VARS.SMTP_HOST),
  secure: false,
  auth: {
    user: getEnvVar(ENV_VARS.SMTP_USER),
    pass: getEnvVar(ENV_VARS.SMTP_PASSWORD),
  },
});

await transport.verify();

export const sendMail = async ({ to, subject, html }) => {
  try {
    await transport.sendMail({
      subject,
      to,
      html,
      from: getEnvVar(ENV_VARS.SMTP_FROM),
    });
  } catch (err) {
    console.log(err);
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};
