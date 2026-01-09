import axios from "axios";
import { env } from "../env";

type OAuthTokenResponse = {
  access_token: string;
  token_type: "Bearer";
  expires_in: number;
  refresh_token?: string;
};

export class OAuthTokenManager {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private expiresAt: number | null = null;
  private inflightPromise: Promise<string> | null = null;

  /**
   * Public entrypoint
   */
  async getAccessToken(): Promise<string> {
    // Still valid
    if (this.accessToken && this.expiresAt && Date.now() < this.expiresAt) {
      return this.accessToken;
    }

    // Prevent stampede
    if (this.inflightPromise) {
      return this.inflightPromise;
    }

    this.inflightPromise = this.refreshToken
      ? this.refreshAccessToken()
      : this.fetchClientCredentialsToken();

    try {
      return await this.inflightPromise;
    } finally {
      this.inflightPromise = null;
    }
  }

  /**
   * Client credentials grant
   */
  private async fetchClientCredentialsToken(): Promise<string> {
    const response = await axios.post<OAuthTokenResponse>(
      "https://api.servicefusion.com/oauth/access_token",
      {
        grant_type: "client_credentials",
        client_id: env.SERVICE_FUSION_CLIENT_ID,
        client_secret: env.SERVICE_FUSION_CLIENT_SECRET,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return this.storeToken(response.data);
  }

  /**
   * Refresh token grant
   */
  private async refreshAccessToken(): Promise<string> {
    const response = await axios.post<OAuthTokenResponse>(
      "https://api.servicefusion.com/oauth/access_token",
      {
        grant_type: "refresh_token",
        refresh_token: this.refreshToken,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return this.storeToken(response.data);
  }

  /**
   * Persist token + expiry
   */
  private storeToken(data: OAuthTokenResponse): string {
    this.accessToken = data.access_token;
    this.refreshToken = data.refresh_token ?? this.refreshToken;

    // Refresh 60s early
    this.expiresAt = Date.now() + (data.expires_in - 60) * 1000;

    return data.access_token;
  }

  /**
   * Force refresh (used after 401)
   */
  async forceRefresh(): Promise<string> {
    this.accessToken = null;
    this.expiresAt = null;
    return this.getAccessToken();
  }
}
