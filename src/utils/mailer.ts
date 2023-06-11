/* eslint-disable @typescript-eslint/no-var-requires */
/*eslint-env es6*/
import { env } from '../config';
const Mailjet = require('node-mailjet');
const mailjet = Mailjet.apiConnect(env.MJ_APIKEY_PUBLIC, env.MJ_APIKEY_PRIVATE);

export default async function sendHtml(email: string, subject = '', body = ``, username = '', text = '') {
  try {
    const mailResponse = await mailjet.post('send', { version: 'v3' }).request({
      FromEmail: env.FROM_EMAIL,
      FromName: env.ADMIN_NAME,
      Recipients: [
        {
          Email: email,
          Name: username,
        },
      ],
      Subject: subject,
      'Html-part': body,
    });
    return { success: mailResponse.body };
  } catch (error: any) {
    return error?.response?.data;
  }
}
