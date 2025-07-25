import { AuthClient } from '@dfinity/auth-client';
import { Identity } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';

export interface ICPAuthResult {
  identity: Identity;
  principal: Principal;
  isAuthenticated: boolean;
}

class ICPAuthService {
  private authClient: AuthClient | null = null;
  private identity: Identity | null = null;

  async init(): Promise<void> {
    this.authClient = await AuthClient.create();
    this.identity = this.authClient.getIdentity();
  }

  async login(): Promise<ICPAuthResult> {
    if (!this.authClient) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      this.authClient!.login({
        identityProvider: process.env.NEXT_PUBLIC_DFX_NETWORK === 'local' 
          ? `http://localhost:4943/?canisterId=${process.env.NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID}`
          : 'https://identity.ic0.app',
        onSuccess: () => {
          this.identity = this.authClient!.getIdentity();
          const principal = this.identity.getPrincipal();
          
          resolve({
            identity: this.identity,
            principal,
            isAuthenticated: !principal.isAnonymous(),
          });
        },
        onError: (error) => {
          reject(new Error(`ICP authentication failed: ${error}`));
        },
        // Optional: Set session timeout (in nanoseconds)
        maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000), // 7 days
      });
    });
  }

  async logout(): Promise<void> {
    if (this.authClient) {
      await this.authClient.logout();
      this.identity = null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    if (!this.authClient) {
      await this.init();
    }
    
    return this.authClient!.isAuthenticated();
  }

  getIdentity(): Identity | null {
    return this.identity;
  }

  getPrincipal(): Principal | null {
    return this.identity?.getPrincipal() || null;
  }

  getPrincipalText(): string | null {
    const principal = this.getPrincipal();
    return principal ? principal.toString() : null;
  }

  // Convert Principal to a format suitable for Firebase user ID
  getPrincipalAsUserId(): string | null {
    const principalText = this.getPrincipalText();
    return principalText ? `icp_${principalText}` : null;
  }

  // Generate a pseudo-email for ICP users (for Firebase compatibility)
  generatePseudoEmail(): string | null {
    const principalText = this.getPrincipalText();
    return principalText ? `${principalText}@icp.identity` : null;
  }
}

export const icpAuthService = new ICPAuthService();