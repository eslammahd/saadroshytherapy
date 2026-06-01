'use client';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function PaymentContent() {
  const params = useSearchParams();
  const bookingId = params.get('bookingId');
  const slotId = params.get('slotId');

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">✅</div>
        <h1 className="text-2xl font-bold text-slate-900">Slot Reserved!</h1>
        <p className="text-slate-500 mt-2">Your slot is held for you. Complete payment to confirm your session.</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
        <p className="font-semibold text-amber-900 mb-1">⏳ Important</p>
        <p className="text-sm text-amber-800">
          Your slot is reserved but not yet confirmed. Please send payment within 24 hours to secure your booking.
        </p>
      </div>

      <h2 className="text-lg font-semibold text-slate-800 mb-4">Payment Options</h2>

      <div className="space-y-4 mb-8">
        {/* Instapay */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-xl">🏦</div>
            <div>
              <p className="font-semibold text-slate-800">Instapay</p>
              <p className="text-xs text-slate-500">Bank transfer via InstaPay</p>
            </div>
          </div>
          <div className="bg-slate-50 rounded-lg px-4 py-3 space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">IPA Username</span>
              <span className="font-mono font-semibold text-slate-800">saadelmahdy</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Amount</span>
              <span className="font-semibold text-slate-800">As agreed</span>
            </div>
          </div>
        </div>

        {/* Vodafone Cash */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-xl">📱</div>
            <div>
              <p className="font-semibold text-slate-800">Vodafone Cash</p>
              <p className="text-xs text-slate-500">Mobile wallet payment</p>
            </div>
          </div>
          <div className="bg-slate-50 rounded-lg px-4 py-3 space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Number</span>
              <span className="font-mono font-semibold text-slate-800">01XXXXXXXXX</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Account Name</span>
              <span className="font-semibold text-slate-800">Saad El Mahdy</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-100 rounded-xl p-4 text-sm text-slate-600 mb-6">
        <p className="font-medium mb-1">After paying:</p>
        <p>Send a screenshot of the payment receipt to Dr. Saad via WhatsApp or phone. Your booking will be confirmed and the video call link will appear on your confirmation page.</p>
      </div>

      <Link
        href={`/confirmation?bookingId=${bookingId}&slotId=${slotId}`}
        className="block w-full text-center bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-xl transition-colors"
      >
        I've sent payment — Show Confirmation →
      </Link>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-slate-400">Loading…</div>}>
      <PaymentContent />
    </Suspense>
  );
}
