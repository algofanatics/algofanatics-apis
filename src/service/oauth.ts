import { OAuth2Client } from 'google-auth-library';

const googleCredentialsPath = '../../credentials.json';

class OAuthService {
  private oAuth2Client: OAuth2Client;

  constructor() {
    const credentials = require(googleCredentialsPath);
    // const { client_secret, client_id, redirect_uris } = credentials.installed;
    // this.oAuth2Client = new OAuth2Client(client_id, client_secret, redirect_uris[0]);
    this.oAuth2Client = new OAuth2Client(
      '276924515417-u0o039opk6thtvibqql2sg00hrestrb1.apps.googleusercontent.com',
      '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',
        'http://localhost:5000/v1.0/api/reports/sheet'
    );
  }

  public generateAuthUrl(): string {
    const SCOPES = [
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/spreadsheets',
    ];
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

export default OAuthService;