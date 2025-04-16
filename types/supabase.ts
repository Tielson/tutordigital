export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      schools: {
        Row: {
          id: string
          name: string
          slug: string
          logo_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          logo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          logo_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      students: {
        Row: {
          id: string
          school_id: string
          name: string
          guardian_name: string
          grade: string
          student_whatsapp: string
          guardian_whatsapp: string
          created_at: string
          updated_at: string
          active: boolean
        }
        Insert: {
          id?: string
          school_id: string
          name: string
          guardian_name: string
          grade: string
          student_whatsapp: string
          guardian_whatsapp: string
          created_at?: string
          updated_at?: string
          active?: boolean
        }
        Update: {
          id?: string
          school_id?: string
          name?: string
          guardian_name?: string
          grade?: string
          student_whatsapp?: string
          guardian_whatsapp?: string
          created_at?: string
          updated_at?: string
          active?: boolean
        }
      }
      blog_posts: {
        Row: {
          id: string
          title: string
          content: string
          slug: string
          excerpt: string | null
          published: boolean
          published_at: string | null
          created_at: string
          updated_at: string
          author_id: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          slug: string
          excerpt?: string | null
          published?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
          author_id: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          slug?: string
          excerpt?: string | null
          published?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
          author_id?: string
        }
      }
    }
  }
}
