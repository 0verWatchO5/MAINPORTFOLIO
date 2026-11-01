export interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  coverImage: string;
  tags: string[];
  publishedAt: string;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Certification {
  _id: string;
  name: string;
  org: string;
  year: string;
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
