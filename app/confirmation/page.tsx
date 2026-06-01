import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Suspense } from 'react';

async function ConfirmationContent({ bookingId, slotId }: { bookingId: string; slotId: string }) {
  const { data: booking } = await supabase
    .from('bookings')
    .select('*, slots(*)')
    .eq('id', bookingId)
    .single();

  if (!booking) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500">Booking not found.</p>
        <Link href="/" className="mt-4 inline-block text-brand-600 hover:underline text-sm">← Back to home</Link>
      </div>
    );
  }

  const slot = booking.slots as { date: string; time: string; video_link: string } | null;

  const slotDate = slot?.date ?? '';
  const slotTime = slot?.time ?? '';
  const videoLink = slot?.video_link ?? '';

  let displayDateTime = 'Your booked slot';
  if (slotDate && slotTime) {
    const dt = new Date(`${slotDate}T${slotTime}`);
    displayDateTime = dt.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }) + ' at ' + dt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">{booking.payment_confirmed ? '🎉' : '⏳'}</div>
        <h1 className="text-2xl font-bold text-slate-900">
          {booking.payment_confirmed ? 'Session Confirmed!' : 'Booking Received'}
        </h1>
        <p className="text-slate-500 mt-2">
          {booking.payment_confirmed
            ? 'Your payment has been confirmed. See you soon!'
            : 'Awaiting payment confirmation from Dr. Saad.'}
        </p>
      </div>

      {/* Booking details */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Patient</span>
          <span className="font-semibold text-slate-800">{booking.patient_name}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Phone</span>
          <span className="font-semibold text-slate-800">{booking.patient_phone}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Session Time</span>
          <span className="font-semibold text-slate-800 text-right max-w-[60%]">{displayDateTime}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Payment</span>
          <span className={`font-semibold ${booking.payment_confirmed ? 'text-green-600' : 'text-amber-600'}`}>
            {booking.payment_confirmed ? '✓ Confirmed' : 'Pending'}
          </span>
        </div>
      </div>

      {/* Video call link */}
      {videoLink ? (
        <div className={`rounded-xl p-5 mb-6 border ${booking.payment_confirmed ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'}`}>
          <p className="text-sm font-semibold text-slate-700 mb-2">🎥 Video Call Link</p>
          {booking.payment_confirmed ? (
            <a
              href={videoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-600 hover:underline text-sm font-mono break-all"
            >
              {videoLink}
            </a>
          ) : (
            <p className="text-sm text-slate-500">
              Your video call link will be active here once Dr. Saad confirms your payment.
            </p>
          )}
        </div>
      ) : null}

      {!booking.payment_confirmed && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 mb-6">
          <p className="font-semibold mb-1">Payment pending</p>
          <p>If you haven't paid yet, please go back and complete payment. Save this page URL to check your confirmation status later.</p>
          <Link href={`/payment?bookingId=${bookingId}&slotId=${slotId}`} className="mt-2 inline-block text-brand-600 hover:underline font-medium">← View payment instructions</Link>
        </div>
      )}

      <div className="text-center">
        <Link href="/" className="text-sm text-slate-400 hover:text-slate-600 hover:underline">← Book another session</Link>
      </div>
    </div>
  );
}

import { Suspense as S } from 'react';

export default function ConfirmationPage({
  searchParams,
}: {
  searchParams: { bookingId?: string; slotId?: string };
}) {
  const bookingId = searchParams.bookingId ?? '';
  const slotId = searchParams.slotId ?? '';

  return (
    <Suspense fallback={<div className="text-center py-12 text-slate-400">Loading your confirmation…</div>}>
      <ConfirmationContent bookingId={bookingId} slotId={slotId} />
    </Suspense>
  );
}
