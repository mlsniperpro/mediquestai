// Centralized authentication service
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  AuthError,
} from 'firebase/auth';
import { auth, googleProvider } from '@/config/firebase';
import { icpAuthService, ICPAuthResult } from './icpAuthService';
import { createUserProfile, getUserProfile } from './userService';
import { AuthProvider } from '@/types/user';
import { handleAsyncError, AppError, ERROR_CODES } from '@/utils/errorHandler';

export interface AuthResult {
  user: User | null;
  error: string | null;
}

export interface ICPAuthUser extends Omit<User, 'uid' | 'email'> {
  uid: string;
  email: string;
}

class AuthService {
  async signUpWithEmail(
    email: string, 
    password: string, 
    displayName?: string
  ): Promise<AuthResult> {
    const [result, error] = await handleAsyncError(async () => {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      if (displayName && user) {
        await updateProfile(user, { displayName });
      }
      
      return user;
    });

    return { user: result, error };
  }

  async signInWithEmail(email: string, password: string): Promise<AuthResult> {
    const [result, error] = await handleAsyncError(async () => {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      return user;
    });

    return { user: result, error };
  }

  async signInWithGoogle(): Promise<AuthResult> {
    const [result, error] = await handleAsyncError(async () => {
      const { user } = await signInWithPopup(auth, googleProvider);
      return user;
    });

    return { user: result, error };
  }

  async signInWithICP(): Promise<{ user: ICPAuthUser | null; error: string | null }> {
    const [result, error] = await handleAsyncError(async () => {
      const icpResult: ICPAuthResult = await icpAuthService.login();
      
      if (!icpResult.isAuthenticated) {
        throw new AppError('ICP authentication failed', ERROR_CODES.ICP_AUTH_FAILED);
      }

      const principalText = icpResult.principal.toString();
      const pseudoEmail = icpAuthService.generatePseudoEmail()!;
      const icpUserId = icpAuthService.getPrincipalAsUserId()!;
      
      // Check if user profile exists
      let profile = await getUserProfile(icpUserId);
      
      if (!profile) {
        await createUserProfile(
          icpUserId,
          pseudoEmail,
          `ICP User ${principalText.slice(0, 8)}...`,
          'icp',
          principalText
        );
        profile = await getUserProfile(icpUserId);
      }
      
      // Create mock User object for ICP users
      const mockUser: ICPAuthUser = {
        uid: icpUserId,
        email: pseudoEmail,
        displayName: profile?.displayName || null,
        emailVerified: true,
        isAnonymous: false,
        metadata: {
          creationTime: profile?.createdAt.toISOString() || new Date().toISOString(),
          lastSignInTime: new Date().toISOString(),
        },
        providerData: [],
        refreshToken: '',
        tenantId: null,
        phoneNumber: null,
        photoURL: null,
        providerId: 'icp',
        delete: async () => {},
        getIdToken: async () => '',
        getIdTokenResult: async () => ({} as any),
        reload: async () => {},
        toJSON: () => ({}),
      };
      
      return mockUser;
    });

    return { user: result, error };
  }

  async signOut(): Promise<{ error: string | null }> {
    const [, error] = await handleAsyncError(async () => {
      await signOut(auth);
    });

    return { error };
  }

  async signOutICP(): Promise<{ error: string | null }> {
    const [, error] = await handleAsyncError(async () => {
      await icpAuthService.logout();
    });

    return { error };
  }

  async resetPassword(email: string): Promise<{ error: string | null }> {
    const [, error] = await handleAsyncError(async () => {
      await sendPasswordResetEmail(auth, email);
    });

    return { error };
  }

  async updateUserProfile(updates: { displayName?: string; photoURL?: string }): Promise<{ error: string | null }> {
    const [, error] = await handleAsyncError(async () => {
      const user = auth.currentUser;
      if (!user) {
        throw new AppError('No user is currently signed in', ERROR_CODES.AUTH_USER_NOT_FOUND);
      }
      
      await updateProfile(user, updates);
    });

    return { error };
  }
}

export const authService = new AuthService();