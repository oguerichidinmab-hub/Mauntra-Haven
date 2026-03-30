import { SupportService } from './types';

export const MOCK_SERVICES: SupportService[] = [
  {
    id: '1',
    name: 'Safe Haven Shelter',
    type: 'shelter',
    contact: '1-800-SAFE-NOW',
    location: 'Downtown Area',
    description: 'Emergency housing and 24/7 support for survivors and their children.'
  },
  {
    id: '2',
    name: 'Justice For All Legal Aid',
    type: 'legal',
    contact: '555-0123',
    location: 'Civic Center',
    description: 'Free legal representation for protection orders and family law matters.'
  },
  {
    id: '3',
    name: 'Healing Hearts Counseling',
    type: 'counseling',
    contact: '555-4567',
    location: 'Westside Medical Park',
    description: 'Trauma-informed therapy and support groups for survivors.'
  },
  {
    id: '4',
    name: 'City General Health Services',
    type: 'health',
    contact: '555-9999',
    location: 'Main Street',
    description: 'Confidential medical care and forensic exams.'
  }
];

export const GROUNDING_TECHNIQUES = [
  {
    title: '5-4-3-2-1 Technique',
    description: 'Acknowledge 5 things you see, 4 things you can touch, 3 things you hear, 2 things you can smell, and 1 thing you can taste.'
  },
  {
    title: 'Box Breathing',
    description: 'Inhale for 4 counts, hold for 4, exhale for 4, hold for 4. Repeat.'
  },
  {
    title: 'Object Focus',
    description: 'Pick an object in the room and describe it in extreme detail to yourself.'
  }
];

export const LEGAL_RIGHTS = [
  {
    title: 'Right to Safety',
    content: 'You have the right to live free from violence and threats.'
  },
  {
    title: 'Protection Orders',
    content: 'You can apply for a court order to keep an abuser away from you.'
  },
  {
    title: 'Confidentiality',
    content: 'Support services are required to keep your information private in most cases.'
  }
];
