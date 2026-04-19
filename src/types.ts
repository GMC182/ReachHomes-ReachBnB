
export type ViewState = 
  | 'auth-select' | 'auth-client' | 'auth-collaborator' | 'auth-partner' | 'auth-owner' | 'auth-admin'
  | 'dash-juan' | 'dash-geo' | 'dash-cluster' | 'dash-owner' | 'dash-collaborator' | 'dash-partner' | 'dash-client'
  | 'public-listing'
  | 'architecture' | 'database' | 'user-management' | 'api' | 'prompts' | 'tests' | 'tasks';

export type UserRole = 'JUAN' | 'ADMIN' | 'GEO_MANAGER' | 'CLUSTER_MANAGER' | 'OWNER' | 'COLLABORATOR' | 'CLIENT' | 'PARTNER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  parentId?: string;
  isVerified?: boolean;
  password?: string;
  lastLogin?: string;
  shiftStatus?: 'ON_SHIFT' | 'OFF_SHIFT' | 'AVAILABLE' | 'BUSY';
  reliabilityScore?: number;
  loyaltyPoints?: number;
  department?: string;
}

export interface Review {
  id: string;
  propertyId: string;
  clientName: string;
  rating: number;
  comment: string;
  date: string;
  ownerResponse?: string;
}

export interface Reservation {
  id: string;
  propertyId: string;
  clientId: string;
  startDate: string;
  endDate: string;
  guests: number;
  totalPrice: number;
  status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'CHECKED_IN' | 'CHECKED_OUT';
}

export interface Property {
  id: string;
  ownerId: string;
  title: string;
  pricePerNight: number;
  image: string;
  images: string[];
  cleaningFee: number;
  serviceFee: number;
  maxGuests: number;
  bedrooms: number;
  beds: number;
  baths: number;
  rating: number;
  status: 'ACTIVE' | 'HIDDEN' | 'MAINTENANCE';
  location: string;
  description: string;
  amenities: string[];
  assignedProfileIds: string[];
  assignedStaffIds: string[];
  netIncome?: number;
  expenses?: number;
}

export interface Task {
  id: string;
  assigneeId: string;
  propertyId: string;
  propertyName: string;
  title: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  description: string;
  checklist?: { id: string; text: string; completed: boolean }[];
  type?: string;
}

export interface SystemHealth {
  cpu: number;
  latency: number;
  activeNodes: number;
  dbStatus: string;
}

export interface PropertyProfile {
  id: string;
  ownerId?: string;
  name: string;
  title?: string;
  image?: string;
  targetAudience?: string;
  priceModifier?: number;
  language?: string;
  description?: string;
  amenities?: string[];
  rules?: string[];
  checkInTime?: string;
  checkOutTime?: string;
}

export interface Column {
  name: string;
  type: string;
  key?: 'PK' | 'FK';
  description: string;
}

export interface Table {
  name: string;
  description: string;
  reasoning: string;
  columns: Column[];
}

export interface Endpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  summary: string;
  response: string;
  reasoning: string;
  businessLogic: string[];
  auditNotes: string[];
  implementationCode: string;
  body?: string;
}

export interface ModulePrompt {
  id: string;
  phase: number;
  title: string;
  description: string;
  promptContent: string;
}

export interface TestSpec {
  id: string;
  title: string;
  userStory: string;
  backendTests: string[];
  frontendTests: string[];
  productionExpectations: string[];
}

export interface TaskTemplate {
  id: string;
  title: string;
  type: string;
  description: string;
  duration: number;
}

export interface ServiceRequest {
  id: string;
  propertyId: string;
  propertyName: string;
  partnerId: string;
  title: string;
  description: string;
  status: 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  date: string;
}

export interface Audit {
  id: string;
  propertyId: string;
  propertyName: string;
  auditorId: string;
  score: number;
  status: 'PASSED' | 'FAILED';
  notes: string;
  date: string;
}
