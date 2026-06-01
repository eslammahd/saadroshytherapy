import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import AdminDashboardClient from '@/components/AdminDashboardClient';

export default async function AdminDashboard() {
  const cookieStore = cookies();
  const auth = cookieStore.get('admin_auth');
  if (auth?.value !== 'true') {
    redirect('/admin/login');
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, slots(*)')
    .order('created_at', { ascending: false });

  const { data: slots } = await supabase
    .from('slots')
    .select('*')
    .order('slot_datetime', { ascending: true });

  return <AdminDashboardClient bookings={bookings || []} slots={slots || []} />;
}
