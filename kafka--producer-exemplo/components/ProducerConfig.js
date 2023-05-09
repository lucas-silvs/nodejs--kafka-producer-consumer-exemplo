import { AccessToken, ClientCredentials } from 'simple-oauth2'
interface OauthBearerProviderOptions {
  clientId: string;
  clientSecret: string;
  host: string;
  path: string;
  refreshThresholdMs: number;
}

const oauthBearerProvider = (options: OauthBearerProviderOptions) => {
  const client = new ClientCredentials({
    client: {
      id: options.clientId,
      secret: options.clientSecret
    },
    auth: {
      tokenHost: options.host,
      tokenPath: options.path
    }
  });

  let tokenPromise: Promise<string>;
  let accessToken: AccessToken;

  async function refreshToken() {
    try {
      if (accessToken == null) {
        accessToken = await client.getToken({})
      }

      if (accessToken.expired(options.refreshThresholdMs / 1000)) {
        accessToken = await accessToken.refresh()
      }

      const nextRefresh = accessToken.token.expires_in * 1000 - options.refreshThresholdMs;
      setTimeout(() => {
        tokenPromise = refreshToken()
      }, nextRefresh);

      return accessToken.token.access_token;
    } catch (error) {
      accessToken = null;
      throw error;
    }
  }

  tokenPromise = refreshToken();

  return async function () {
    return {
      value: await tokenPromise
    }
  }
};

const kafka = new Kafka({
  // ... other required options
  sasl: {
    mechanism: 'oauthbearer',
    oauthBearerProvider: oauthBearerProvider({
      clientId: 'oauth-client-id',
      clientSecret: 'oauth-client-secret',
      host: 'https://my-oauth-server.com',
      path: '/oauth/token',
      // Refresh the token 15 seconds before it expires
      refreshThreshold: 15000,
    }),
  },
})