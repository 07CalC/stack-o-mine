type GoogleTokenResponse = {
  access_token: string;
  expires_in: number;
}

export class GoogleClient {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope: string[] = ['profile', 'email', 'openid'];
  private authUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  private tokenUrl = 'https://oauth2.googleapis.com/token'
  private userInfoUrl = 'https://www.googleapis.com/oauth2/v3/userinfo';


  constructor(options: {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    scope?: string[];
  }) {
    this.clientId = options.clientId;
    this.clientSecret = options.clientSecret;
    this.redirectUri = options.redirectUri;
    if (options.scope) {
      this.scope = options.scope;
    }
  }

  getAuthUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: this.scope.join(' '),
      state,
    });
    return `${this.authUrl}?${params.toString()}`;
  }

  async getToken(code: string): Promise<GoogleTokenResponse> {
    const params = new URLSearchParams({
      code,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectUri,
      grant_type: 'authorization_code',
    });
    const response = await fetch(this.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });
    return response.json() as Promise<GoogleTokenResponse>;
  }

  async refreshToken(refreshToken: string): Promise<GoogleTokenResponse> {
    const params = new URLSearchParams({
      refresh_token: refreshToken,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: 'refresh_token',
    });
    const response = await fetch(this.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });
    return response.json() as Promise<GoogleTokenResponse>;
  }

  async getUserInfo(accessToken: string): Promise<any> {
    const response = await fetch(this.userInfoUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.json();
  }

}
