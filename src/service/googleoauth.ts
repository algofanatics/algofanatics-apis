import { OAuth2Client } from 'google-auth-library';
import { LoginTicket } from 'google-auth-library/build/src/auth/loginticket';

class googleOauthService {
  private oAuth2Client: OAuth2Client;

  constructor() {
    this.oAuth2Client = new OAuth2Client(
      '277608211651-9896h10scplos6g7j7m9h77vc3gj4bpt.apps.googleusercontent.com',
      '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',
      'http://localhost:5000/v1.0/auth/gg/signin'
    );
  }

  public generateAuthUrl(): string {
    const SCOPES = ['profile'];
    return this.oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
  }

  public async getUserInfo(
    code: string
  ): Promise<{ username: string; email: string; phoneNumber: string; image: string }> {
    const tokenResponse = await this.oAuth2Client.getToken(code);
    this.oAuth2Client.setCredentials(tokenResponse.tokens);
    const idToken = tokenResponse.tokens.id_token as string;

    const ticket: LoginTicket = await this.oAuth2Client.verifyIdToken({
      idToken,
      audience: this.oAuth2Client._clientId,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error('Invalid token payload');
    }

    const email = payload?.email || '';
    const username = payload?.name || '';
    const phoneNumber = payload?.profile || '';
    const image = payload?.picture || '';
    return {
      username,
      email,
      phoneNumber,
      image,
    };
  }

  public getAuthClient(): OAuth2Client {
    return this.oAuth2Client;
  }
}

export default new googleOauthService();
