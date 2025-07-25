import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { UserProfile, RoleSelectionData, AuthProvider } from '@/types/user';

export const createUserProfile = async (
  uid: string, 
  email: string, 
  displayName?: string, 
  authProvider: AuthProvider = 'firebase',
  icpPrincipal?: string
): Promise<void> => {
  const userRef = doc(db, 'users', uid);
  const userProfile: Partial<UserProfile> = {
    uid,
    email,
    displayName,
    authenticationComplete: false,
    authProvider,
    icpPrincipal,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  await setDoc(userRef, userProfile);
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    return userSnap.data() as UserProfile;
  }
  return null;
};

export const updateUserRole = async (uid: string, roleData: RoleSelectionData): Promise<void> => {
  const userRef = doc(db, 'users', uid);
  const updateData: Partial<UserProfile> = {
    role: roleData.role,
    authenticationComplete: true,
    updatedAt: new Date(),
  };

  // Add role-specific fields
  if (roleData.facilityName) {
    updateData.facilityName = roleData.facilityName;
  }
  if (roleData.licenseNumber) {
    updateData.licenseNumber = roleData.licenseNumber;
  }
  if (roleData.specialization) {
    updateData.specialization = roleData.specialization;
  }

  await updateDoc(userRef, updateData);
};

export const checkUserExists = async (email: string): Promise<boolean> => {
  // This is a simple check - in a real app you might want to use a more sophisticated method
  // For now, we'll rely on Firebase Auth errors to determine if user exists
  return false;
};