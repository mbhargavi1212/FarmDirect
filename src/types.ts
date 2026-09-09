export type UserRole = 'farmer' | 'buyer' | 'admin';
export type BuyerType = 'retail' | 'institutional';
export type CropCategory = string;
export type QualityGrade = string;
export type LanguageCode = 'en' | 'hi' | 'te';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  [key: string]: any;
}

export interface Product { [key: string]: any; }
export interface Order { [key: string]: any; }
export interface FairPriceAssessment { [key: string]: any; }
export interface LogisticsShipment { [key: string]: any; }
export interface TransactionRecord { [key: string]: any; }
export interface DemandPrediction { [key: string]: any; }
export interface AppNotification { [key: string]: any; }
export interface PlatformAnalytics { [key: string]: any; }
export interface ProductLocalizedInfo { [key: string]: any; }
