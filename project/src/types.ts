export interface UserDetails {
  fullName: string;
  email: string;
  phone: string;
  jobTitle: string;
  companyName: string;
  skills: string[];
  experience?: string;
  education?: string;
  achievements?: string[];
  linkedIn?: string;
  portfolio?: string;
  customSignature?: string;
  salutation?: string;
  recipientName?: string;
  recipientTitle?: string;
  companyAddress?: string;
}

export type TemplateStyle = 'formal' | 'casual' | 'technical';

export interface Template {
  id: TemplateStyle;
  name: string;
  description: string;
  icon: string;
  preview: string;
  generate: (details: UserDetails) => string;
}

export interface LetterVersion {
  timestamp: number;
  letter: string;
  template: TemplateStyle;
  details: UserDetails;
}

export interface LetterStats {
  characters: number;
  words: number;
  readabilityScore: number;
}