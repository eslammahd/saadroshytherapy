import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Slot = {
  id: string;
  date: string;
  time: string;
  is_available: boolean;
  video_link: string;
  slot_datetime: string | null;
  created_at: string;
};

export type Booking = {
  id: string;
  slot_id: string;
  patient_name: string;
  patient_phone: string;
  payment_confirmed: boolean;
  created_at: string;
};
