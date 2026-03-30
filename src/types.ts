export interface TrustedContact {
  id: string;
  name: string;
  phone: string;
  relation: string;
}

export interface SupportService {
  id: string;
  name: string;
  type: 'shelter' | 'legal' | 'counseling' | 'health';
  contact: string;
  location: string;
  description: string;
}

export interface IncidentNote {
  id: string;
  date: string;
  content: string;
  evidenceUrl?: string;
}

export interface UserSettings {
  nickname: string;
  language: string;
  isHighContrast: boolean;
  isLargeText: boolean;
  isSimpleUI: boolean;
  notificationsEnabled: boolean;
  quickExitRedirect: string;
}

export type AppScreen = 'home' | 'support' | 'emergency' | 'resources' | 'assistant' | 'profile' | 'onboarding';
