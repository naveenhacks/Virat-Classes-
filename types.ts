export type Role = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  class?: string;
  board?: string;
  stream?: string; // PCM, PCB, General
  password?: string; // For mock auth
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'general' | 'test' | 'batch';
}

export interface Course {
  id: string;
  title: string;
  classRange: string; // "1-10" or "11-12"
  boards: string[];
  description: string;
  subjects: string[];
  timing: string;
}

export interface TestResult {
  id: string;
  studentId: string;
  testName: string;
  date: string;
  score: number;
  totalMarks: number;
}

export interface TestSchedule {
  id: string;
  title: string;
  date: string;
  link?: string;
  classGroup: string; // e.g., "12-PCM"
}

export interface StudyMaterial {
  id: string;
  courseId: string; // Linked to a specific course/batch
  title: string;
  type: 'pdf' | 'image' | 'text' | 'video';
  url?: string; // For files/images/videos
  content?: string; // For text posts
  date: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  contact: string;
  message: string;
  date: string;
  status: 'new' | 'read';
}

export interface SiteConfig {
  // Hero Section
  heroTitle: string;
  heroSubtitle: string;
  heroTagline: string;

  // Features Section
  featuresTitle: string;
  featuresSubtitle: string;

  // Courses Page
  coursesPageTitle: string;
  coursesPageSubtitle: string;

  // About Page
  aboutPageTitle: string;
  aboutPageSubtitle: string;
  ownerName: string;
  ownerTitle: string;
  ownerTitle2?: string; // Optional secondary title
  ownerQuote: string;
  philosophyTitle: string;
  philosophyDescription: string;

  // Contact Page
  contactPageTitle: string;

  // Footer & General Contact
  ownerContact: string;
  address: string;
  email: string;
  footerDescription: string;
  
  // Socials
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}