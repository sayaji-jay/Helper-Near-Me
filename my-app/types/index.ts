export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  work: string[];
  address: string;
  village: string;
  city: string;
  state: string;
  companyName: string;
  description: string;
  experience: string;
  avatar: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Testimonial {
  name: string;
  title: string;
  company: string;
  quote: string;
  avatar: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface UsersResponse {
  success: boolean;
  users: User[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface BulkUploadResponse {
  success: boolean;
  message: string;
  inserted: number;
  errors: number;
  error_details: string[];
}
