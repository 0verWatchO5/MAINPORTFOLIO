export interface Project {
  _id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  details: string;
  approach: string[];
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactProfile {
  _id: string;
  type: "profile";
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  updatedAt?: string;
}

export interface ContactMessage {
  _id: string;
  type: "message";
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt?: string;
}
