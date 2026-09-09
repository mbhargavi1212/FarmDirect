/**
 * FarmDirect - Direct Farmer-to-Consumer Market Platform
 * Authentication & Firestore User Profile Management Service
 * 
 * Firestore Architecture Rules:
 * - User profiles are stored in the Firestore `users/{uid}` schema
 * - Passwords are NEVER stored in Firestore user profiles
 * - Password credentials are kept in a separate secure auth credential store
 * - Full validation for Farmer & Buyer registration with role-based attributes
 */

import { UserProfile, UserRole, BuyerType } from '../types';

export interface FarmerRegistrationInput {
  displayName: string;
  phoneNumber: string;
  email: string;
  password: string;
  state: string;
  district: string;
  village: string;
  farmLocation: string;
  farmSize: string; // e.g., '12 Acres'
  mainCrops: string[];
  avatarUrl?: string;
}

export interface BuyerRegistrationInput {
  displayName: string; // Name / Organization name
  buyerType: BuyerType; // 'retail' | 'institutional'
  phoneNumber: string;
  email: string;
  password: string;
  state: string;
  district: string;
  businessAddress: string;
  requiredProducts: string[];
  typicalPurchaseQuantity: string; // e.g., '500 kg / week'
  avatarUrl?: string;
}

interface AuthCredential {
  uid: string;
  email: string;
  passwordHash: string;
  resetToken?: string;
  resetTokenExpiry?: number;
}

const STORAGE_KEYS = {
  USERS_COLLECTION: 'farmdirect_firestore_users',
  CREDENTIALS_COLLECTION: 'farmdirect_auth_credentials',
  CURRENT_SESSION: 'farmdirect_auth_session',
};

// Simple reversible obfuscation for client-side demo credentials
const hashPassword = (password: string): string => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    hash = (hash << 5) - hash + password.charCodeAt(i);
    hash |= 0;
  }
  return `hash_${Math.abs(hash)}_${btoa(password.slice(0, 3))}`;
};

// Seed initial Firestore user profiles and credentials
const initializeStorage = () => {
  const existingUsers = localStorage.getItem(STORAGE_KEYS.USERS_COLLECTION);
  const existingCreds = localStorage.getItem(STORAGE_KEYS.CREDENTIALS_COLLECTION);

  if (!existingUsers || !existingCreds) {
    const seedProfiles: Record<string, UserProfile> = {
      'farmer-001': {
        uid: 'farmer-001',
        email: 'ramesh.farmer@farmdirect.in',
        displayName: 'Ramesh Patel',
        phoneNumber: '+91 98251 44321',
        role: 'farmer',
        verificationStatus: 'verified',
        state: 'Madhya Pradesh',
        district: 'Sehore',
        village: 'Ashta',
        farmLocation: 'Near Narmada Canal, Survey No. 42',
        farmSize: '14.5 Acres',
        mainCrops: ['Sharbati Wheat', 'Soybean', 'Chana (Gram)', 'Mustard'],
        avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80',
        pincode: '466001',
        farmDetails: {
          farmName: 'Narmada Valley Organic Agro',
          totalLandAcres: 14.5,
          kisanCreditCardNumber: 'KCC-MP-44891',
          primaryCrops: ['Sharbati Wheat', 'Soybean', 'Chana (Gram)', 'Mustard'],
          organicCertified: true,
          apmcMandiNearest: 'Sehore Krishi Upaj Mandi',
        },
        walletBalance: 148500,
        rating: 4.9,
        totalRatingsCount: 38,
        createdAt: '2025-11-10T10:00:00.000Z',
        updatedAt: '2026-03-01T12:00:00.000Z',
      },
      'buyer-retail-001': {
        uid: 'buyer-retail-001',
        email: 'retail.buyer@freshmart.in',
        displayName: 'Akshay Verma (FreshMart Retailers)',
        phoneNumber: '+91 99876 54321',
        role: 'buyer',
        buyerType: 'retail',
        buyerSubtype: 'retailer',
        verificationStatus: 'verified',
        state: 'Maharashtra',
        district: 'Pune',
        businessAddress: 'Shop 12-14, Green Valley Commercial Complex, Kothrud',
        requiredProducts: ['Wheat', 'Tomatoes', 'Onions', 'Potatoes', 'Mustard Oil'],
        typicalPurchaseQuantity: '500 kg - 1,200 kg / week',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        pincode: '411038',
        businessDetails: {
          businessName: 'FreshMart Retail Stores',
          gstin: '27AABCF1234F1Z8',
          licenseNumber: 'FSSAI-1152026000123',
          procurementCapacityTons: 15,
          procurementFrequency: 'weekly',
        },
        walletBalance: 240000,
        rating: 4.8,
        totalRatingsCount: 42,
        createdAt: '2025-10-15T09:30:00.000Z',
        updatedAt: '2026-03-02T15:00:00.000Z',
      },
      'buyer-inst-001': {
        uid: 'buyer-inst-001',
        email: 'procurement@freshmartretail.com',
        displayName: 'Apex Canteen & Hospitality Logistics',
        phoneNumber: '+91 98450 11223',
        role: 'buyer',
        buyerType: 'institutional',
        buyerSubtype: 'institutional',
        verificationStatus: 'verified',
        state: 'Karnataka',
        district: 'Bengaluru Urban',
        businessAddress: 'Plot 45, Peenya Industrial Area Phase 2, Outer Ring Road',
        requiredProducts: ['Basmati Rice', 'Sharbati Wheat', 'Toor Dal', 'Potatoes', 'Red Onions'],
        typicalPurchaseQuantity: '5 - 15 Metric Tons / month',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
        pincode: '560058',
        businessDetails: {
          businessName: 'Apex Institutional Canteen Logistics',
          gstin: '29ABCDE1234F2Z5',
          licenseNumber: 'FSSAI-1122026000987',
          procurementCapacityTons: 60,
          procurementFrequency: 'weekly',
        },
        walletBalance: 420000,
        rating: 4.9,
        totalRatingsCount: 54,
        createdAt: '2025-09-15T09:30:00.000Z',
        updatedAt: '2026-03-02T15:00:00.000Z',
      },
      'admin-001': {
        uid: 'admin-001',
        email: 'admin@farmdirect.gov.in',
        displayName: 'Dr. Sunita Rao (Nodal Oversight Officer)',
        phoneNumber: '+91 98111 22334',
        role: 'admin',
        verificationStatus: 'verified',
        state: 'Delhi',
        district: 'New Delhi',
        pincode: '110001',
        avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
        walletBalance: 0,
        rating: 5.0,
        totalRatingsCount: 120,
        createdAt: '2025-08-01T08:00:00.000Z',
        updatedAt: '2026-03-04T10:00:00.000Z',
      },
    };

    const seedCredentials: Record<string, AuthCredential> = {
      'ramesh.farmer@farmdirect.in': {
        uid: 'farmer-001',
        email: 'ramesh.farmer@farmdirect.in',
        passwordHash: hashPassword('farmer123'),
      },
      'retail.buyer@freshmart.in': {
        uid: 'buyer-retail-001',
        email: 'retail.buyer@freshmart.in',
        passwordHash: hashPassword('buyer123'),
      },
      'procurement@freshmartretail.com': {
        uid: 'buyer-inst-001',
        email: 'procurement@freshmartretail.com',
        passwordHash: hashPassword('buyer123'),
      },
      'admin@farmdirect.gov.in': {
        uid: 'admin-001',
        email: 'admin@farmdirect.gov.in',
        passwordHash: hashPassword('admin123'),
      },
    };

    localStorage.setItem(STORAGE_KEYS.USERS_COLLECTION, JSON.stringify(seedProfiles));
    localStorage.setItem(STORAGE_KEYS.CREDENTIALS_COLLECTION, JSON.stringify(seedCredentials));
  }
};

// Initialize on module load
initializeStorage();

export const AuthService = {
  // Get all Firestore user profiles
  getUsersCollection(): Record<string, UserProfile> {
    initializeStorage();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS_COLLECTION);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },

  // Get credentials (kept separate from user profile documents)
  getCredentials(): Record<string, AuthCredential> {
    initializeStorage();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CREDENTIALS_COLLECTION);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },

  // Save updated users collection
  saveUsersCollection(users: Record<string, UserProfile>) {
    localStorage.setItem(STORAGE_KEYS.USERS_COLLECTION, JSON.stringify(users));
  },

  // Save updated credentials
  saveCredentials(creds: Record<string, AuthCredential>) {
    localStorage.setItem(STORAGE_KEYS.CREDENTIALS_COLLECTION, JSON.stringify(creds));
  },

  // Get User Profile from Firestore by UID
  getUserProfile(uid: string): UserProfile | null {
    const users = this.getUsersCollection();
    return users[uid] || null;
  },

  // Sign In with Email & Password
  async signIn(emailInput: string, passwordInput: string): Promise<UserProfile> {
    const email = emailInput.trim().toLowerCase();
    const password = passwordInput.trim();

    if (!email) {
      throw new Error('Please enter your email address.');
    }
    if (!password) {
      throw new Error('Please enter your password.');
    }

    const creds = this.getCredentials();
    const userCred = creds[email];

    if (!userCred) {
      throw new Error('No account found with this email address. Please check your spelling or register.');
    }

    const computedHash = hashPassword(password);
    if (userCred.passwordHash !== computedHash) {
      throw new Error('Incorrect password. Please verify and try again, or use "Forgot Password".');
    }

    const userProfile = this.getUserProfile(userCred.uid);
    if (!userProfile) {
      throw new Error('User profile record not found in Firestore. Please contact support.');
    }

    // Persist active session
    this.saveSession(userProfile);
    return userProfile;
  },

  // Register Farmer
  async registerFarmer(data: FarmerRegistrationInput): Promise<UserProfile> {
    const email = data.email.trim().toLowerCase();
    const phone = data.phoneNumber.trim();
    const name = data.displayName.trim();

    // Validation
    if (!name || name.length < 2) {
      throw new Error('Please enter your full name (minimum 2 characters).');
    }
    if (!phone) {
      throw new Error('Please enter your mobile phone number.');
    }
    if (!/^\+?[0-9\s-]{10,14}$/.test(phone.replace(/\s+/g, ''))) {
      throw new Error('Please enter a valid 10-digit mobile number.');
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Please enter a valid email address.');
    }
    if (!data.password || data.password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }
    if (!data.state) {
      throw new Error('Please select your state.');
    }
    if (!data.district) {
      throw new Error('Please enter your district.');
    }
    if (!data.village) {
      throw new Error('Please enter your village name.');
    }
    if (!data.farmLocation) {
      throw new Error('Please describe your farm location or landmark.');
    }
    if (!data.farmSize) {
      throw new Error('Please enter your farm size (e.g. 10 Acres).');
    }
    if (!data.mainCrops || data.mainCrops.length === 0) {
      throw new Error('Please select at least one primary crop.');
    }

    const creds = this.getCredentials();
    if (creds[email]) {
      throw new Error('An account with this email already exists. Please sign in instead.');
    }

    const uid = `farmer-${Date.now()}`;
    const now = new Date().toISOString();

    // Firestore User Profile (PASSWORD IS NOT STORED HERE)
    const newProfile: UserProfile = {
      uid,
      email,
      displayName: name,
      phoneNumber: phone,
      role: 'farmer',
      verificationStatus: 'verified',
      state: data.state,
      district: data.district,
      village: data.village,
      farmLocation: data.farmLocation,
      farmSize: data.farmSize,
      mainCrops: data.mainCrops,
      avatarUrl: data.avatarUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80',
      farmDetails: {
        farmName: `${name}'s Farm`,
        totalLandAcres: parseFloat(data.farmSize) || 5,
        primaryCrops: data.mainCrops,
        organicCertified: false,
        apmcMandiNearest: `${data.district} Krishi Upaj Mandi`,
      },
      walletBalance: 0,
      rating: 5.0,
      totalRatingsCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    // Save user profile in Firestore collection
    const users = this.getUsersCollection();
    users[uid] = newProfile;
    this.saveUsersCollection(users);

    // Save auth credential in separate credential store
    creds[email] = {
      uid,
      email,
      passwordHash: hashPassword(data.password),
    };
    this.saveCredentials(creds);

    // Persist session
    this.saveSession(newProfile);
    return newProfile;
  },

  // Register Buyer (Retail or Institutional)
  async registerBuyer(data: BuyerRegistrationInput): Promise<UserProfile> {
    const email = data.email.trim().toLowerCase();
    const phone = data.phoneNumber.trim();
    const name = data.displayName.trim();

    // Validation
    if (!name || name.length < 2) {
      throw new Error('Please enter your name or organization name.');
    }
    if (!data.buyerType) {
      throw new Error('Please select buyer type (Retail Buyer or Institutional Buyer).');
    }
    if (!phone) {
      throw new Error('Please enter your contact phone number.');
    }
    if (!/^\+?[0-9\s-]{10,14}$/.test(phone.replace(/\s+/g, ''))) {
      throw new Error('Please enter a valid 10-digit phone number.');
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Please enter a valid business email address.');
    }
    if (!data.password || data.password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }
    if (!data.state) {
      throw new Error('Please select your state.');
    }
    if (!data.district) {
      throw new Error('Please enter your district.');
    }
    if (!data.businessAddress) {
      throw new Error('Please enter your complete business or procurement address.');
    }
    if (!data.requiredProducts || data.requiredProducts.length === 0) {
      throw new Error('Please specify at least one required produce item.');
    }
    if (!data.typicalPurchaseQuantity) {
      throw new Error('Please specify your typical purchase quantity.');
    }

    const creds = this.getCredentials();
    if (creds[email]) {
      throw new Error('An account with this email already exists. Please sign in instead.');
    }

    const uid = `buyer-${data.buyerType}-${Date.now()}`;
    const now = new Date().toISOString();

    // Firestore User Profile (PASSWORD IS NOT STORED HERE)
    const newProfile: UserProfile = {
      uid,
      email,
      displayName: name,
      phoneNumber: phone,
      role: 'buyer',
      buyerType: data.buyerType,
      buyerSubtype: data.buyerType === 'retail' ? 'retailer' : 'institutional',
      verificationStatus: 'verified',
      state: data.state,
      district: data.district,
      businessAddress: data.businessAddress,
      requiredProducts: data.requiredProducts,
      typicalPurchaseQuantity: data.typicalPurchaseQuantity,
      avatarUrl: data.avatarUrl || (data.buyerType === 'retail'
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80'),
      businessDetails: {
        businessName: name,
        procurementCapacityTons: data.buyerType === 'retail' ? 10 : 50,
        procurementFrequency: 'weekly',
      },
      walletBalance: 50000,
      rating: 5.0,
      totalRatingsCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    // Save profile in Firestore collection
    const users = this.getUsersCollection();
    users[uid] = newProfile;
    this.saveUsersCollection(users);

    // Save auth credential in separate credential store
    creds[email] = {
      uid,
      email,
      passwordHash: hashPassword(data.password),
    };
    this.saveCredentials(creds);

    // Persist session
    this.saveSession(newProfile);
    return newProfile;
  },

  // Request Password Reset Code
  async requestPasswordReset(emailInput: string): Promise<{ success: boolean; resetCode: string; message: string }> {
    const email = emailInput.trim().toLowerCase();
    if (!email) {
      throw new Error('Please provide your registered email address.');
    }

    const creds = this.getCredentials();
    const userCred = creds[email];

    if (!userCred) {
      throw new Error('No registered account was found with this email address.');
    }

    // Generate a 6-digit verification code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    userCred.resetToken = resetCode;
    userCred.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 mins validity
    this.saveCredentials(creds);

    return {
      success: true,
      resetCode,
      message: `A password reset code has been sent to ${email}.`,
    };
  },

  // Confirm Password Reset
  async confirmPasswordReset(emailInput: string, resetCode: string, newPassword: string): Promise<boolean> {
    const email = emailInput.trim().toLowerCase();
    const code = resetCode.trim();

    if (!email || !code) {
      throw new Error('Email and verification code are required.');
    }
    if (!newPassword || newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters long.');
    }

    const creds = this.getCredentials();
    const userCred = creds[email];

    if (!userCred) {
      throw new Error('User record not found.');
    }

    if (!userCred.resetToken || userCred.resetToken !== code) {
      throw new Error('Invalid or expired reset code. Please check and try again.');
    }

    if (userCred.resetTokenExpiry && Date.now() > userCred.resetTokenExpiry) {
      throw new Error('The reset code has expired. Please request a new one.');
    }

    // Update password hash and clear reset token
    userCred.passwordHash = hashPassword(newPassword);
    delete userCred.resetToken;
    delete userCred.resetTokenExpiry;
    this.saveCredentials(creds);

    return true;
  },

  // Session Management
  saveSession(user: UserProfile) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(user));
  },

  getCurrentSession(): UserProfile | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  clearSession() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
  },
};
