'use client';
import { useState } from 'react';

type Slot = {
  id: string;
  slot_datetime: string;
  is_available: boolean;
  video_link: string;
};

type Booking = {
  id: string;
  patient_name: string;
  patient_phone: string;
  payment_confirmed: boolean;
  created_at: string;
  slots: Slot | null;
};

export default function AdminDashboardClient({
  bookings: initialBookings,
  slots: initialSlots,
}: {
  bookings: Booking[];
  slots: Slot[];
}) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [slots, setSlots] = useState<Slot[]>(initialSlots);
  const [activeTab, setActiveTab] = useState<'bookings' | 'slots'>('bookings');
  const [newSlotDatetime, setNewSlotDatetime] = useState('');
  const [newSlotVideoLink, setNewSlotVideoLink] = useState('');
  const [addingSlot, setAddingSlot] = useState(false);
  const [slotMsg, setSlotMsg] = useState('');

  async function togglePayment(bookingId: string, current: boolean) {
    const res = await fetch('/api/admin/toggle-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId, confirmed: !current }),
    });
    if (res.ok) {
      setBookings(prev =>
        prev.map(b => b.id === bookingId ? { ...b, payment_confirmed: !current } : b)
      );
    }
  }

  async function deleteSlot(slotId: string) {
    const res = await fetch('/api/admin/delete-slot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slotId }),
    });
    if (res.ok) {
      setSlots(prev => prev.filter(s => s.id !== slotId));
    }
  }

  async function addSlot(e: React.FormEvent) {
    e.preventDefault();
    setAddingSlot(true);
    setSlotMsg('');
    const res = await fetch('/api/admin/add-slot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ datetime: newSlotDatetime, videoLink: newSlotVideoLink }),
    });
    const data = await res.json();
    if (data.slot) {
      setSlots(prev => [...prev, data.slot].sort((a, b) =>
        new Date(a.slot_datetime).getTime() - new Date(b.slot_datetime).getTime()
      ));
      setNewSlotDatetime('');
      setNewSlotVideoLink('');
      setSlotMsg('✅ تمت إضافة الموعد بنجاح');
    } else {
      setSlotMsg('❌ حدث خطأ أثناء الإضافة');
    }
    setAddingSlot(false);
  }

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  }

  function formatDate(dt: string) {
    return new Date(dt).toLocaleString('ar-EG', {
      weekday: 'long', year: 'numeric', month: 'long',
      day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  }

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-800">لوحة تحكم د. سعد المهدي</h1>
            <p className="text-slate-500 text-sm">إدارة المواعيد والحجوزات</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-slate-500 hover:text-red-500 transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            تسجيل الخروج
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 border border-slate-200 text-center">
            <p className="text-3xl font-bold text-teal-600">{bookings.length}</p>
            <p className="text-slate-500 text-sm mt-1">إجمالي الحجوزات</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-slate-200 text-center">
            <p className="text-3xl font-bold text-green-600">{bookings.filter(b => b.payment_confirmed).length}</p>
            <p className="text-slate-500 text-sm mt-1">تم تأكيد الدفع</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-slate-200 text-center">
            <p className="text-3xl font-bold text-amber-500">{slots.filter(s => s.is_available).length}</p>
            <p className="text-slate-500 text-sm mt-1">مواعيد متاحة</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === 'bookings' ? 'bg-teal-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            الحجوزات ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('slots')}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === 'slots' ? 'bg-teal-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            المواعيد ({slots.length})
          </button>
        </div>

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="space-y-3">
            {bookings.length === 0 && (
              <div className="bg-white rounded-xl p-8 text-center text-slate-400 border border-slate-200">
                لا توجد حجوزات بعد
              </div>
            )}
            {bookings.map(b => (
              <div key={b.id} className="bg-white rounded-xl p-5 border border-slate-200">
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-800 text-lg">{b.patient_name}</p>
                    <p className="text-slate-500 text-sm">📞 {b.patient_phone}</p>
                    {b.slots && (
                      <p className="text-slate-500 text-sm">🗓 {formatDate(b.slots.slot_datetime)}</p>
                    )}
                    <p className="text-slate-400 text-xs">
                      تم الحجز: {new Date(b.created_at).toLocaleDateString('ar-EG')}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      b.payment_confirmed ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {b.payment_confirmed ? '✅ تم تأكيد الدفع' : '⏳ في انتظار الدفع'}
                    </span>
                    <button
                      onClick={() => togglePayment(b.id, b.payment_confirmed)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                        b.payment_confirmed
                          ? 'border-slate-200 text-slate-500 hover:bg-slate-50'
                          : 'border-teal-300 text-teal-700 bg-teal-50 hover:bg-teal-100'
                      }`}
                    >
                      {b.payment_confirmed ? 'إلغاء التأكيد' : 'تأكيد الدفع'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Slots Tab */}
        {activeTab === 'slots' && (
          <div className="space-y-4">
            {/* Add Slot Form */}
            <div className="bg-white rounded-xl p-5 border border-teal-200">
              <h2 className="font-semibold text-slate-800 mb-4">➕ إضافة موعد جديد</h2>
              <form onSubmit={addSlot} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block text-sm text-slate-600 mb-1">التاريخ والوقت</label>
                  <input
                    type="datetime-local"
                    value={newSlotDatetime}
                    onChange={e => setNewSlotDatetime(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
                <div className="sm:col-span-1">
                  <label className="block text-sm text-slate-600 mb-1">رابط الفيديو (اختياري)</label>
                  <input
                    type="url"
                    value={newSlotVideoLink}
                    onChange={e => setNewSlotVideoLink(e.target.value)}
                    placeholder="https://meet.google.com/..."
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    dir="ltr"
                  />
                </div>
                <div className="sm:col-span-1 flex items-end">
                  <button
                    type="submit"
                    disabled={addingSlot}
                    className="w-full bg-teal-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-teal-700 disabled:opacity-50 transition-colors"
                  >
                    {addingSlot ? 'جاري الإضافة...' : 'إضافة الموعد'}
                  </button>
                </div>
              </form>
              {slotMsg && <p className="text-sm mt-3">{slotMsg}</p>}
            </div>

            {/* Slots List */}
            <div className="space-y-3">
              {slots.length === 0 && (
                <div className="bg-white rounded-xl p-8 text-center text-slate-400 border border-slate-200">
                  لا توجد مواعيد
                </div>
              )}
              {slots.map(s => (
                <div key={s.id} className="bg-white rounded-xl p-4 border border-slate-200 flex items-center justify-between flex-wrap gap-3">
                  <div className="space-y-1">
                    <p className="font-medium text-slate-800">{formatDate(s.slot_datetime)}</p>
                    {s.video_link && (
                      <a href={s.video_link} target="_blank" rel="noopener noreferrer" className="text-teal-600 text-xs hover:underline" dir="ltr">
                        {s.video_link}
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      s.is_available ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {s.is_available ? 'متاح' : 'محجوز'}
                    </span>
                    <button
                      onClick={() => deleteSlot(s.id)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                      title="حذف الموعد"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
