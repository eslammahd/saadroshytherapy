import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dr. Saad El Mahdy — Online Therapy',
  description: 'Book an online therapy session with Dr. Saad El Mahdy, MD Therapist. Easy scheduling, secure payment, video consultation.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-800">
        <header className="bg-white border-b border-slate-200 shadow-sm">
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold text-lg">S</div>
            <div>
              <p className="font-semibold text-slate-900 leading-tight">Dr. Saad El Mahdy</p>
              <p className="text-xs text-slate-500">MD · Psychiatrist &amp; Therapist</p>
            </div>
          </div>
        </header>
        <main className="max-w-3xl mx-auto px-4 py-8">{children}</main>
        <footer className="border-t border-slate-200 mt-16">
          <div className="max-w-3xl mx-auto px-4 py-6 text-center text-sm text-slate-400">
            © {new Date().getFullYear()} Dr. Saad El Mahdy. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
