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
    authenticationComplete: false,
    authProvider,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Only add optional fields if they have values (not undefined)
  if (displayName !== undefined) {
    userProfile.displayName = displayName;
  }
  if (icpPrincipal !== undefined) {
    userProfile.icpPrincipal = icpPrincipal;
  }
  
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
  
  // First check if the document exists
  const userSnap = await getDoc(userRef);
  
  const updateData: Partial<UserProfile> = {
    role: roleData.role,
    authenticationComplete: true,
    updatedAt: new Date(),
  };

  // Add role-specific fields only if they have values
  if (roleData.facilityName !== undefined && roleData.facilityName.trim() !== '') {
    updateData.facilityName = roleData.facilityName;
  }
  if (roleData.licenseNumber !== undefined && roleData.licenseNumber.trim() !== '') {
    updateData.licenseNumber = roleData.licenseNumber;
  }
  if (roleData.specialization !== undefined && roleData.specialization.trim() !== '') {
    updateData.specialization = roleData.specialization;
  }

  if (userSnap.exists()) {
    // Document exists, update it
    await updateDoc(userRef, updateData);
  } else {
    // Document doesn't exist, create it with setDoc
    // This shouldn't normally happen, but it's a safety net
    // We need to get the existing user data to avoid losing information
    const existingData = userSnap.exists() ? userSnap.data() : {};
    const fullUserData: Partial<UserProfile> = {
      uid,
      authenticationComplete: false,
      authProvider: 'firebase', // Default fallback
      createdAt: new Date(),
      ...existingData, // Preserve any existing data
      ...updateData, // Apply the updates
    };
    
    // Remove any undefined values before setting
    Object.keys(fullUserData).forEach(key => {
      if (fullUserData[key as keyof UserProfile] === undefined) {
        delete fullUserData[key as keyof UserProfile];
      }
    });
    
    await setDoc(userRef, fullUserData);
  }
};

export const checkUserExists = async (email: string): Promise<boolean> => {
  // This is a simple check - in a real app you might want to use a more sophisticated method
  // For now, we'll rely on Firebase Auth errors to determine if user exists
  return false;
};