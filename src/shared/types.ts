// Shared types to prevent circular imports

export interface Profile {
  id: string
  email: string
  first_name?: string
  last_name?: string
  username?: string
  title?: string
  company?: string
  phone?: string
  website?: string
  bio?: string
  avatar_url?: string
}

export interface AuthContextType {
  user: any | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, userData: any) => Promise<void>
  signOut: () => Promise<void>
}

export interface AuthFormData {
  email: string
  password: string
  first_name?: string
  last_name?: string
}