import { supabase, Slot } from '@/lib/supabase';
import Link from 'next/link';

function formatDate(dateStr: string, timeStr: string): string {
  const dt = new Date(`${dateStr}T${timeStr}`);
  return dt.toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatTime(timeStr: string): string {
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${m} ${ampm}`;
}

export const revalidate = 60;

export default async function HomePage() {
  const today = new Date().toISOString().split('T')[0];
  const { data: slots, error } = await supabase
    .from('slots')
    .select('*')
    .eq('is_available', true)
    .gte('date', today)
    .order('date', { ascending: true })
    .order('time', { ascending: true });

  return (
    <div>
      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Book a Therapy Session</h1>
        <p className="text-slate-500 max-w-lg mx-auto">
          Choose an available slot below. No sign-up needed. After booking you'll receive a secure video call link.
        </p>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { step: '1', label: 'Pick a slot', icon: '📅' },
          { step: '2', label: 'Pay offline', icon: '💳' },
          { step: '3', label: 'Join session', icon: '💻' },
        ].map(({ step, label, icon }) => (
          <div key={step} className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <div className="text-2xl mb-1">{icon}</div>
            <div className="text-xs font-medium text-brand-600 uppercase tracking-wide">Step {step}</div>
            <div className="text-sm font-semibold text-slate-700 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Slots */}
      <h2 className="text-lg font-semibold text-slate-800 mb-4">Available Slots</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
          Could not load slots. Please try again later.
        </div>
      )}

      {!error && (!slots || slots.length === 0) && (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
          <p className="text-4xl mb-3">📭</p>
          <p className="font-medium">No slots available right now.</p>
          <p className="text-sm mt-1">Please check back soon or contact us directly.</p>
        </div>
      )}

      <div className="space-y-3">
        {slots?.map((slot: Slot) => (
          <div
            key={slot.id}
            className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:border-brand-500 hover:shadow-sm transition-all"
          >
            <div>
              <p className="font-semibold text-slate-800">{formatDate(slot.date, slot.time)}</p>
              <p className="text-sm text-slate-500 mt-0.5">{formatTime(slot.time)} · Online via video call</p>
            </div>
            <Link
              href={`/book/${slot.id}`}
              className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
            >
              Book
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-brand-50 border border-brand-100 rounded-xl p-5 text-sm text-brand-900">
        <p className="font-semibold mb-1">💡 How it works</p>
        <p>After booking, you'll be shown payment instructions (Instapay / Vodafone Cash). Once payment is sent, Dr. Saad will confirm your booking and you'll receive your video call link on the confirmation page.</p>
      </div>
    </div>
  );
}
