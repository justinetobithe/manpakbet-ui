export type Role = "user" | "admin";

export default interface User {
  id: string;
  email: string;
  role: Role;
  first_name: string;
  last_name: string;
  phone: string | null;
  auth_token: string;
  emailVerified?: string | null;
}

export interface UserStateDefinition {
  user: User | null;
  isAuthenticated: boolean;
}

export interface UserStateActions {
  setUser: (user: User | null) => void;
  clearUser: () => void;
  setAuth: (value: boolean) => void;
}
