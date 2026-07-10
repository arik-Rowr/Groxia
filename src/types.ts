export interface Mentor {
  _id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  expertise: string[];
  socials: {
    linkedin?: string;
    twitter?: string;
  };
}



export interface User {
  id?: string;
  role?: "admin" | "user",
  full_name?: string;
  email: string;
  phone?: string;
  gender?: string;
  college?: string;
  course?: string;
  branch?: string;
  graduation_year?: string;
  state?: string;
  city?: string;
  skills?: string[];
  linkedin?: string;
  certificates?: any[];
  internships?: any[];
  is_active?: boolean;
}

export interface Internship {
  id: string;
  title: string;
  company: string;
  location: string;
  duration: string;
  stipend: string;
  description: string;
  requirements: string;
  status: "Active" | "Inactive";
  createdAt: string;

  // ✅ ADD THESE
  imageUrl?: string;
  public_id?: string;
}

export interface Ad {
  _id: string;         // ← changed from id to _id
  image: string;
  height?: string;
  width?: string;
  buttonText?: string;
  buttonLink?: string;
  buttonColor?: string;
  buttonBg?: string;
  buttonSize?: string;
  buttonBorderRadius?: string;
  autoCloseSeconds?: number;
  active?: boolean;
  order?: number;
  views?: number;
  clicks?: number;
}
