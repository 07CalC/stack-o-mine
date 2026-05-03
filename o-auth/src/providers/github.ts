




export class GithubClient {
  clientId: string;
  clientSecret: string
  redirectUri: string;
  scope: string[] = ['read:user', 'user:email'];
  private authUrl = 'https://github.com/login/oauth/authorize';
  private tokenUrl = 'https://github.com/login/oauth/access_token';
  private userInfoUrl = 'https://api.github.com/user';
  private emailUrl = 'https://api.github.com/user/emails';

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
      scope: this.scope.join(' '),
      state,
    });
    return `${this.authUrl}?${params.toString()}`;
  }

  async getToken(code: string): Promise<{ access_token: string; token_type: string; scope: string }> {
    const params = new URLSearchParams({
      code,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectUri,
    });
    const response = await fetch(this.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: params.toString(),
    });
    return response.json() as Promise<{ access_token: string; token_type: string; scope: string }>;
  }

  async getUserInfo(accessToken: string): Promise<any> {
    const response = await fetch(this.userInfoUrl, {
      headers: {
        Authorization: `token ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });
    return response.json();
  }

  async getUserEmail(accessToken: string): Promise<any> {
    const response = await fetch(this
      .emailUrl, {
      headers: {
        Authorization: `token ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });
    return response.json();
  }

}
