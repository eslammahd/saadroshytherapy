'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase, Slot } from '@/lib/supabase';

function formatDateTime(dateStr: string, timeStr: string): string {
  const dt = new Date(`${dateStr}T${timeStr}`);
  return dt.toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) + ' at ' + dt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

export default function BookPage() {
  const { slotId } = useParams<{ slotId: string }>();
  const router = useRouter();

  const [slot, setSlot] = useState<Slot | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    async function loadSlot() {
      const { data, error } = await supabase
        .from('slots')
        .select('*')
        .eq('id', slotId)
        .eq('is_available', true)
        .single();
      if (error || !data) {
        setError('This slot is no longer available.');
      } else {
        setSlot(data);
      }
      setLoading(false);
    }
    loadSlot();
  }, [slotId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError('Please fill in your name and phone number.');
      return;
    }
    setSubmitting(true);
    setError('');

    // Insert booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({ slot_id: slotId, patient_name: name.trim(), patient_phone: phone.trim() })
      .select('id')
      .single();

    if (bookingError || !booking) {
      setError('Could not complete booking. Please try again.');
      setSubmitting(false);
      return;
    }

    // Mark slot unavailable
    await supabase.from('slots').update({ is_available: false }).eq('id', slotId);

    router.push(`/payment?bookingId=${booking.id}&slotId=${slotId}`);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-slate-400 text-sm">Loading slot…</div>
      </div>
    );
  }

  if (error && !slot) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-700 font-medium">{error}</p>
        <a href="/" className="mt-4 inline-block text-sm text-brand-600 hover:underline">← Back to slots</a>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <a href="/" className="text-sm text-brand-600 hover:underline mb-6 inline-block">← Back to slots</a>

      <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6">
        <p className="text-xs font-semibold text-brand-600 uppercase tracking-wide mb-1">Selected Slot</p>
        <p className="font-semibold text-slate-800 text-lg">
          {slot ? formatDateTime(slot.date, slot.time) : ''}
        </p>
        <p className="text-sm text-slate-500 mt-1">Online session · 50 minutes</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h1 className="text-xl font-bold text-slate-900 mb-5">Your Details</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Ahmed Mohamed"
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="e.g. 01XXXXXXXXX"
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {submitting ? 'Booking…' : 'Confirm Booking →'}
          </button>
        </form>
      </div>
    </div>
  );
}
