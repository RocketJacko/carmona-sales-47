import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://eaaijmcjevhrpfwpxtwg.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhYWlqbWNqZXZocnBmd3B4dHdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzMjc0NzUsImV4cCI6MjA2MDkwMzQ3NX0.KrXbn9U45Qq-srDXoVF3RsMkTIY729knVSwlOISh3as'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos de datos para las tablas
export type User = {
  id: string
  email: string
  name: string
  role: string
  created_at: string
}

export type Client = {
  id: string
  name: string
  email: string
  phone: string
  address: string
  created_at: string
}

export type Sale = {
  id: string
  client_id: string
  amount: number
  status: string
  created_at: string
}

export type Product = {
  id: string
  name: string
  description: string
  price: number
  stock: number
  created_at: string
}

export type Appointment = {
  id: string
  client_id: string
  title: string
  description: string
  date: string
  status: string
  created_at: string
} 