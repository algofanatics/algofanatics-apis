/* eslint-disable @typescript-eslint/no-var-requires */
/*eslint-env es6*/
const env = require('../configs/env');
require('dotenv').config({ path: env });
const mailjet = require('node-mailjet').connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);

/**
 *
 * @param {payload} URL, confirmationCode, toEmail, fullName
 * @returns {object} - mailjet response body
 */
const sendConfirmationMail = async ({
  confirmationCode,
  toEmail,
  fullName,
}: {
  confirmationCode: string;
  toEmail: string;
  fullName: string;
}) => {
  try {
    const mailResponse = await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: process.env.FROM_EMAIL,
            Name: process.env.ADMIN_NAME,
          },
          To: [
            {
              Email: toEmail,
              Name: fullName,
            },
          ],
          Subject: 'Welcome To WEEJA.',
          TextPart: 'My first Mailjet email',
          HTMLPart: `
 <!DOCTYPE html>
<html
  xmlns="http://www.w3.org/1999/xhtml"
  xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:o="urn:schemas-microsoft-com:office:office"
>
  <head>
    <title>confirm email address</title>
    <!--[if !mso]><!-->
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!--<![endif]-->
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <style type="text/css">
      #outlook a {
        padding: 0;
      }
      body {
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
      }
      table,
      td {
        border-collapse: collapse;
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
      }
      img {
        border: 0;
        height: auto;
        line-height: 100%;
        outline: none;
        text-decoration: none;
        -ms-interpolation-mode: bicubic;
      }
      p {
        display: block;
        margin: 13px 0;
      }
    </style>
    <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:AllowPNG />
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
    <![endif]-->
    <!--[if lte mso 11]>
      <style type="text/css">
        .mj-outlook-group-fix {
          width: 100% !important;
        }
      </style>
    <![endif]-->
    <style type="text/css">
      @media only screen and (min-width: 480px) {
        .mj-column-per-100 {
          width: 100% !important;
          max-width: 100%;
        }
      }
    </style>
    <style media="screen and (min-width:480px)">
      .moz-text-html .mj-column-per-100 {
        width: 100% !important;
        max-width: 100%;
      }
    </style>
    <style type="text/css">
      [owa] .mj-column-per-100 {
        width: 100% !important;
        max-width: 100%;
      }
    </style>
    <style type="text/css">
      @media only screen and (max-width: 480px) {
        table.mj-full-width-mobile {
          width: 100% !important;
        }
        td.mj-full-width-mobile {
          width: auto !important;
        }
      }
    </style>
  </head>
  <body style="word-spacing: normal; background-color: #e4eeff">
    <div style="background-color: #e4eeff">
      <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
      <div style="margin: 0px auto; max-width: 600px">
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%">
          <tbody>
            <tr>
              <td
                style="
                  direction: ltr;
                  font-size: 0px;
                  padding: 20px 0px 20px 0px;
                  padding-left: 0px;
                  padding-right: 0px;
                  text-align: center;
                "
              >
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
                <div
                  class="mj-column-per-100 mj-outlook-group-fix"
                  style="
                    font-size: 0px;
                    text-align: left;
                    direction: ltr;
                    display: inline-block;
                    vertical-align: top;
                    width: 100%;
                  "
                >
                  <table
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    role="presentation"
                    style="vertical-align: top"
                    width="100%"
                  >
                    <tbody>
                      <tr>
                        <td
                          align="left"
                          style="
                            font-size: 0px;
                            padding: 0px 25px 0px 25px;
                            padding-top: 0px;
                            padding-right: 25px;
                            padding-bottom: 0px;
                            word-break: break-word;
                          "
                        >
                          <div
                            style="
                              font-family: Arial, sans-serif;
                              font-size: 13px;
                              letter-spacing: normal;
                              line-height: 1;
                              text-align: left;
                              color: #000000;
                            "
                          >
                            <p
                              class="text-build-content"
                              style="
                                line-height: 32px;
                                text-align: center;
                                margin: 10px 0;
                                margin-top: 10px;
                                margin-bottom: 10px;
                              "
                              data-testid="YXEjb3w38FuuG"
                            >
                              <span style="color: #27272b; font-family: Arial; font-size: 16px"
                                >THANK YOU FOR REGISTERING!</span
                              >
                            </p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td
                          align="center"
                          style="
                            font-size: 0px;
                            padding: 10px 25px 10px 25px;
                            padding-right: 25px;
                            padding-left: 25px;
                            word-break: break-word;
                          "
                        >
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            role="presentation"
                            style="border-collapse: collapse; border-spacing: 0px"
                          >
                            <tbody>
                              <tr>
                                <td style="width: 130px">
                                  <img
                                    alt="logo"
                                    height="auto"
                                    src="../assets/images/Weeja-logo.svg"
                                    style="
                                      border: none;
                                      display: block;
                                      outline: none;
                                      text-decoration: none;
                                      height: auto;
                                      width: 100%;
                                      font-size: 13px;
                                    "
                                    width="130"
                                  />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="#ffffff" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
      <div style="background: #ffffff; background-color: #ffffff; margin: 0px auto; max-width: 600px">
        <table
          align="center"
          border="0"
          cellpadding="0"
          cellspacing="0"
          role="presentation"
          style="background: #ffffff; background-color: #ffffff; width: 100%"
        >
          <tbody>
            <tr>
              <td style="direction: ltr; font-size: 0px; padding: 20px 0px 20px 0px; text-align: center">
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
                <div
                  class="mj-column-per-100 mj-outlook-group-fix"
                  style="
                    font-size: 0px;
                    text-align: left;
                    direction: ltr;
                    display: inline-block;
                    vertical-align: top;
                    width: 100%;
                  "
                >
                  <table
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    role="presentation"
                    style="vertical-align: top"
                    width="100%"
                  >
                    <tbody>
                      <tr>
                        <td
                          align="center"
                          style="
                            font-size: 0px;
                            padding: 30px 25px 10px 25px;
                            padding-top: 30px;
                            padding-right: 25px;
                            padding-left: 25px;
                            word-break: break-word;
                          "
                        >
                          <p style="border-top: solid 2px #3d86ff; font-size: 1px; margin: 0px auto; width: 25%"></p>
                          <!--[if mso | IE
                            ]><table
                              align="center"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              style="border-top: solid 2px #3d86ff; font-size: 1px; margin: 0px auto; width: 137.5px"
                              role="presentation"
                              width="137.5px"
                            >
                              <tr>
                                <td style="height: 0; line-height: 0">&nbsp;</td>
                              </tr>
                            </table><!
                          [endif]-->
                        </td>
                      </tr>
                      <tr>
                        <td
                          align="left"
                          style="
                            font-size: 0px;
                            padding: 0px 25px 0px 25px;
                            padding-top: 0px;
                            padding-right: 25px;
                            padding-bottom: 0px;
                            padding-left: 25px;
                            word-break: break-word;
                          "
                        >
                          <div
                            style="
                              font-family: Arial, sans-serif;
                              font-size: 32px;
                              letter-spacing: normal;
                              line-height: 1;
                              text-align: left;
                              color: #000000;
                            "
                          >
                            <h1
                              class="text-build-content"
                              style="
                                line-height: 32px;
                                text-align: center;
                                margin-top: 10px;
                                margin-bottom: 10px;
                                font-weight: normal;
                              "
                              data-testid="wwe8IurqDJp29"
                            >
                              <span style="color: #27272b; font-family: Times New Roman; font-size: 32px"
                                ><b>please confirm your email address!</b></span
                              >
                            </h1>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td
                          align="center"
                          vertical-align="middle"
                          style="
                            font-size: 0px;
                            padding: 20px 25px 20px 25px;
                            padding-top: 20px;
                            padding-right: 25px;
                            padding-bottom: 20px;
                            padding-left: 25px;
                            word-break: break-word;
                          "
                        >
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            role="presentation"
                            style="border-collapse: separate; line-height: 100%"
                          >
                            <tbody>
                              <tr>
                                <td
                                  align="center"
                                  bgcolor="#3d86ff"
                                  role="presentation"
                                  style="
                                    border: none;
                                    border-radius: 0px;
                                    cursor: auto;
                                    mso-padding-alt: 15px 25px 15px 25px;
                                    background: #3d86ff;
                                  "
                                  valign="middle"
                                >
                                    <a style="text-decoration: none; cursor: pointer" href=${process.env.BASE_URL}/auth/vfy/${confirmationCode} >
                                  <p
                                    style="
                                      display: inline-block;
                                      background: #3d86ff;
                                      color: #ffffff;
                                      font-family: Arial, sans-serif;
                                      font-size: 16px;
                                      font-weight: normal;
                                      line-height: 120%;
                                      margin: 0;
                                      text-decoration: none;
                                      text-transform: none;
                                      padding: 15px 25px 15px 25px;
                                      mso-padding-alt: 0px;
                                      border-radius: 0px;
                                    "
                                  ><span style="font-size: 16px; cursor: pointer"><b>confirm</b></span>
                                </p>
                              </a>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td
                          align="center"
                          style="
                            font-size: 0px;
                            padding: 30px 25px 10px 25px;
                            padding-top: 30px;
                            padding-right: 25px;
                            padding-left: 25px;
                            word-break: break-word;
                          "
                        >
                          <p style="border-top: solid 2px #3d86ff; font-size: 1px; margin: 0px auto; width: 25%"></p>
                          <!--[if mso | IE
                            ]><table
                              align="center"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              style="border-top: solid 2px #3d86ff; font-size: 1px; margin: 0px auto; width: 137.5px"
                              role="presentation"
                              width="137.5px"
                            >
                              <tr>
                                <td style="height: 0; line-height: 0">&nbsp;</td>
                              </tr>
                            </table><!
                          [endif]-->
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
      <div style="margin: 0px auto; max-width: 600px">
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%">
          <tbody>
            <tr>
              <td
                style="
                  direction: ltr;
                  font-size: 0px;
                  padding: 0px 0px 20px 0px;
                  padding-left: 0px;
                  padding-right: 0px;
                  padding-top: 0px;
                  text-align: center;
                "
              >
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
                <div
                  class="mj-column-per-100 mj-outlook-group-fix"
                  style="
                    font-size: 0px;
                    text-align: left;
                    direction: ltr;
                    display: inline-block;
                    vertical-align: top;
                    width: 100%;
                  "
                >
                  <table
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    role="presentation"
                    style="vertical-align: top"
                    width="100%"
                  >
                    <tbody>
                      <tr>
                        <td
                          align="left"
                          style="
                            font-size: 0px;
                            padding: 0px 20px 0px 20px;
                            padding-top: 0px;
                            padding-right: 20px;
                            padding-bottom: 0px;
                            padding-left: 20px;
                            word-break: break-word;
                          "
                        >
                          <div
                            style="
                              font-family: Arial, sans-serif;
                              font-size: 13px;
                              letter-spacing: normal;
                              line-height: 1;
                              text-align: left;
                              color: #000000;
                            "
                          >
                            <p
                              class="text-build-content"
                              style="line-height: 32px; text-align: center; margin: 10px 0; margin-top: 10px"
                              data-testid="cnbwnMfiKh7sXd"
                            >
                              &nbsp;
                            </p>
                            <p
                              class="text-build-content"
                              style="line-height: 32px; text-align: center; margin: 10px 0; margin-bottom: 10px"
                              data-testid="cnbwnMfiKh7sXd"
                            >
                              <span style="color: #27272b; font-family: Arial; font-size: 16px"
                                >This e-mail was sent to ${toEmail} because you tried to sign up. Click </span
                              ><a
                                class="link-build-content"
                                style="color: inherit; text-decoration: none"
                                target="_blank"
                                href="#"
                                ><span style="color: #3d86ff; font-family: Arial; font-size: 16px">here</span></a
                              ><span style="color: #27272b; font-family: Arial; font-size: 16px"> to contact support if this was a mistake.</span>
                            </p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--[if mso | IE]></td></tr></table><![endif]-->
    </div>
  </body>
</html>
          `,
          CustomID: `weeja-${confirmationCode}`,
        },
      ],
    });
    return { success: mailResponse.body };
  } catch (error) {
    return { error };
  }
};

module.exports = { sendConfirmationMail };