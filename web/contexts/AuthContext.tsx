'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider } from '@/config/firebase';
import { UserProfile, RoleSelectionData, type AuthProvider } from '@/types/user';
import { createUserProfile, getUserProfile, updateUserRole } from '@/services/userService';
import { icpAuthService, ICPAuthResult } from '@/services/icpAuthService';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  needsRoleSelection: boolean;
  authProvider: AuthProvider | null;
  icpPrincipal: string | null;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithICP: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  completeRoleSelection: (roleData: RoleSelectionData) => Promise<void>;
  checkUserExists: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsRoleSelection, setNeedsRoleSelection] = useState(false);
  const [authProvider, setAuthProvider] = useState<AuthProvider | null>(null);
  const [icpPrincipal, setIcpPrincipal] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        try {
          let profile = await getUserProfile(user.uid);
          if (profile) {
            setUserProfile(profile);
            setAuthProvider(profile.authProvider);
            setIcpPrincipal(profile.icpPrincipal || null);
            setNeedsRoleSelection(!profile.authenticationComplete);
          } else {
            // User exists in Firebase Auth but not in Firestore - create profile
            const provider = user.providerData[0]?.providerId === 'google.com' ? 'google' : 'firebase';
            await createUserProfile(user.uid, user.email!, user.displayName || undefined, provider);
            
            // Fetch the newly created profile
            profile = await getUserProfile(user.uid);
            if (profile) {
              setUserProfile(profile);
            }
            setAuthProvider(provider);
            setNeedsRoleSelection(true);
          }
        } catch (error) {
          console.error('Error fetching/creating user profile:', error);
          // Even if profile creation fails, we still need to set the auth provider
          const provider = user.providerData[0]?.providerId === 'google.com' ? 'google' : 'firebase';
          setAuthProvider(provider);
          setNeedsRoleSelection(true);
        }
      } else {
        setUserProfile(null);
        setAuthProvider(null);
        setIcpPrincipal(null);
        setNeedsRoleSelection(false);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string, displayName?: string) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName && user) {
      await updateProfile(user, { displayName });
    }
    // User profile will be created in the onAuthStateChanged listener
  };

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const signInWithICP = async () => {
    try {
      const icpResult: ICPAuthResult = await icpAuthService.login();
      
      if (icpResult.isAuthenticated) {
        const principalText = icpResult.principal.toString();
        const pseudoEmail = icpAuthService.generatePseudoEmail()!;
        const icpUserId = icpAuthService.getPrincipalAsUserId()!;
        
        // Check if user profile exists in Firestore
        let profile = await getUserProfile(icpUserId);
        
        if (!profile) {
          // Create new user profile for ICP user
          await createUserProfile(
            icpUserId,
            pseudoEmail,
            `ICP User ${principalText.slice(0, 8)}...`,
            'icp',
            principalText
          );
          profile = await getUserProfile(icpUserId);
        }
        
        // Set the user state manually for ICP users (since they don't use Firebase Auth)
        const mockUser = {
          uid: icpUserId,
          email: pseudoEmail,
          displayName: profile?.displayName,
          emailVerified: true,
          isAnonymous: false,
          metadata: {
            creationTime: profile?.createdAt.toISOString(),
            lastSignInTime: new Date().toISOString(),
          },
          providerData: [],
          refreshToken: '',
          tenantId: null,
          // Add missing User methods as no-ops for ICP users
          delete: async () => {},
          getIdToken: async () => '',
          getIdTokenResult: async () => ({} as any),
          reload: async () => {},
          toJSON: () => ({}),
        } as unknown as User;
        
        setUser(mockUser);
        setUserProfile(profile);
        setAuthProvider('icp');
        setIcpPrincipal(principalText);
        setNeedsRoleSelection(!profile?.authenticationComplete);
      }
    } catch (error) {
      throw new Error(`ICP authentication failed: ${error}`);
    }
  };

  const logout = async () => {
    if (authProvider === 'icp') {
      await icpAuthService.logout();
      setUser(null);
      setUserProfile(null);
      setAuthProvider(null);
      setIcpPrincipal(null);
      setNeedsRoleSelection(false);
    } else {
      await signOut(auth);
    }
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const completeRoleSelection = async (roleData: RoleSelectionData) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      console.log('Completing role selection for user:', user.uid, 'with data:', roleData);
      await updateUserRole(user.uid, roleData);
      
      // Refresh user profile
      const updatedProfile = await getUserProfile(user.uid);
      if (updatedProfile) {
        setUserProfile(updatedProfile);
        setNeedsRoleSelection(false);
        console.log('Role selection completed successfully');
      } else {
        console.error('Failed to fetch updated user profile after role selection');
        throw new Error('Failed to update user profile');
      }
    } catch (error) {
      console.error('Error completing role selection:', error);
      throw error;
    }
  };

  const checkUserExists = async (email: string): Promise<boolean> => {
    // This is a simplified implementation
    // In a real app, you might want to use Firebase Admin SDK or a cloud function
    // For now, we'll rely on the sign-in error handling to determine if user exists
    return false;
  };

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    needsRoleSelection,
    authProvider,
    icpPrincipal,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithICP,
    logout,
    resetPassword,
    completeRoleSelection,
    checkUserExists,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}