export interface UserJwtPayload {
  sub: string;
  email: string;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
}
