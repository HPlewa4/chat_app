export interface User {
  username: string;
  email: string;
  profile_pic?: string;
}

export interface AuthResponse {
  message: string;
  username: string;
  email: string;
  id?: string;
  profile_pic?: string;
}

export interface SearchUser {
  username: string;
  profile_pic?: string;
}

export interface ChatSession {
  id: string;
  username: string;
  last_message: string;
  updated_at: string;
  profile_pic?: string;
}