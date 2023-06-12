import { Request, Response } from 'express';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

const googleCredentialsPath = '../../../credentials.json';

class OAuthController {
  private oAuth2Client: OAuth2Client;

  constructor() {
    const credentials = require(googleCredentialsPath);
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    this.oAuth2Client = new OAuth2Client(client_id, client_secret, redirect_uris[0]);
  }

  public generateAuthUrl(): string {
    const SCOPES = ['https://www.googleapis.com/auth/drive'];
    return this.oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
  }

  public async getToken(code: string): Promise<void> {
    const tokenResponse = await this.oAuth2Client.getToken(code);
    this.oAuth2Client.setCredentials(tokenResponse.tokens);
  }

  public getAuthClient(): OAuth2Client {
    return this.oAuth2Client;
  }
}
