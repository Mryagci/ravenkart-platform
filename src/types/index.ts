export type UserRole = 'SUPER_ADMIN' | 'ORG_ADMIN' | 'MEMBER' | 'VIEWER'
export type PlanType = 'FREE' | 'PRO' | 'CORPORATE'
export type Theme = 'light' | 'dark'

export interface Profile {
  id: string
  organization_id?: string
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
  role: UserRole
  theme: Theme
  language: string
  ribbon_gradient: {
    start: string
    end: string
  }
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface SocialLink {
  id: string
  user_id: string
  platform: string
  username: string
  url?: string
  is_visible: boolean
  created_at: string
}

export interface Project {
  id: string
  user_id: string
  title: string
  description?: string
  cover_image_url?: string
  external_url?: string
  slug?: string
  is_visible: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Organization {
  id: string
  name: string
  slug: string
  logo_url?: string
  plan: PlanType
  max_seats: number
  used_seats: number
  subscription_status: string
  subscription_end?: string
  created_at: string
  updated_at: string
}

export interface PublicProfile {
  profile: Profile
  social_links: SocialLink[]
  projects: Project[]
}