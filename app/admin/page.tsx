import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default function AdminRoot() {
  const cookieStore = cookies();
  const auth = cookieStore.get('admin_auth');
  if (auth?.value === 'true') {
    redirect('/admin/dashboard');
  } else {
    redirect('/admin/login');
  }
}
