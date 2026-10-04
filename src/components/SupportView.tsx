import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MessageSquare, 
  Send, 
  HelpCircle, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  ShieldCheck,
  Headphones,
  Flame
} from 'lucide-react';
import { SupportConfig, SupportTicket } from '../types';
import { formatDateTime } from '../utils';

interface SupportViewProps {
  onBack: () => void;
  supportConfig?: SupportConfig;
  userEmail?: string;
  onAddTicket?: (ticket: SupportTicket) => void;
}

const DEFAULT_SUPPORT_CONFIG: SupportConfig = {
  whatsappNumber: '+91 9823537634',
  email: 'techreal8806@gmail.com',
  telegramLink: '', // Old telegram channel removed as requested ("telegram channel removel kar dijiye sir pahle vala")
  telegramHandle: '',
  notice: 'Our priority support desk is available 24/7 for deposit, withdrawal, and bandwidth assistance.',
};

export const SupportView: React.FC<SupportViewProps> = ({ 
  onBack,
  supportConfig = DEFAULT_SUPPORT_CONFIG,
  userEmail = 'techreal8806@gmail.com',
  onAddTicket,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const cleanWhatsApp = supportConfig.whatsappNumber.replace(/[^0-9]/g, '');

  const faqs = [
    {
      q: 'How does bandwidth data selling work?',
      a: 'When you activate "Sell Data", your idle, unused internet bandwidth is shared securely with our verified enterprise network for content delivery and web indexing. You earn real money in Rupees for every megabyte shared.'
    },
    {
      q: 'What is 5G Turbo Speed Mode?',
      a: '5G Turbo Speed mode streams data packets 10x faster (at 800ms interval with 2.5MB per packet). It can be unlocked with a ₹99 one-time activation fee.'
    },
    {
      q: 'How do deposits & withdrawals work?',
      a: 'Deposits are made via PhonePe, GPay, Paytm, or any UPI app using the QR Scanner and official UPI ID. Withdrawals are processed instantly to your configured UPI ID once the one-time ₹99 verification fee is completed.'
    },
    {
      q: 'Is my personal data safe?',
      a: 'Yes, 100%. Our software only shares raw internet bandwidth connectivity. It cannot access your private files, browsing history, passwords, or personal apps.'
    },
    {
      q: 'What is the minimum withdrawal amount?',
      a: 'First-time withdrawal minimum limit is ₹250. Second time and subsequent withdrawal minimum limit is ₹500.'
    }
  ];

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) return;

    if (onAddTicket) {
      const newTicket: SupportTicket = {
        id: 'ticket_' + Date.now(),
        userEmail: userEmail,
        subject: ticketSubject.trim(),
        message: ticketMessage.trim(),
        timestamp: formatDateTime(new Date()),
        status: 'NEW',
      };
      onAddTicket(newTicket);
    }

    setIsSubmitted(true);
    setTicketSubject('');
    setTicketMessage('');
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 space-y-4 pb-28 text-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          id="btn-support-back"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-red-600 py-1.5 px-3 rounded-xl hover:bg-amber-100/50 transition-all cursor-pointer min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4 text-red-600" />
          <span>Dashboard</span>
        </button>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-red-950 text-xs font-bold shadow-xs">
          <Headphones className="w-3.5 h-3.5 text-red-600" />
          <span>24/7 Priority Desk</span>
        </div>

        <div className="w-8" />
      </div>

      {/* Support Hero Card in Red & Yellow Theme */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-600 via-rose-600 to-amber-500 text-white border-2 border-yellow-300 p-5 shadow-xl shadow-red-600/20 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center shrink-0 shadow-md border border-yellow-200">
            <MessageSquare className="w-6 h-6 text-yellow-300" />
          </div>
          <div>
            <h2 className="text-sm font-black text-white">Priority Concierge Support</h2>
            <p className="text-xs text-amber-100 mt-0.5">Instant assistance for UPI deposits, payout clearance & UTR</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 pt-2">
          <a
            href={`https://wa.me/${cleanWhatsApp}?text=Hello%20DataSell%20Support`}
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-4 rounded-2xl bg-white hover:bg-amber-50 text-red-950 text-xs font-black flex items-center justify-center gap-2 transition-all min-h-[44px] shadow-sm border border-yellow-300"
          >
            <span>Chat on WhatsApp Support Desk</span>
            <ExternalLink className="w-3.5 h-3.5 text-red-600" />
          </a>
        </div>
      </div>

      {/* FAQs in Red & Yellow Theme */}
      <div className="bg-white rounded-3xl p-5 border-2 border-amber-200 shadow-md space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-red-950 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-red-600" />
          <span>Frequently Asked Questions</span>
        </h3>

        <div className="space-y-2">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div 
                key={index}
                className="border border-amber-200 rounded-2xl overflow-hidden transition-all bg-amber-50/30"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-3.5 text-left text-xs font-bold text-slate-800 flex items-center justify-between gap-2 hover:bg-amber-100/50 cursor-pointer min-h-[44px]"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-red-600 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                </button>
                {isOpen && (
                  <div className="px-3.5 pb-3.5 text-xs text-slate-600 leading-relaxed border-t border-amber-100 pt-2 bg-white">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Ticket Submission Form in Red & Yellow Theme */}
      <form onSubmit={handleSubmitTicket} className="bg-white rounded-3xl p-5 border-2 border-amber-200 shadow-md space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-red-950">
          Create Priority Ticket
        </h3>

        {isSubmitted && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Ticket submitted successfully! Our executive will respond shortly.</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
          <input
            type="text"
            required
            value={ticketSubject}
            onChange={(e) => setTicketSubject(e.target.value)}
            placeholder="e.g. Withdrawal UTR verification inquiry"
            className="w-full px-3 py-2 rounded-xl border border-amber-300 text-xs text-slate-900 bg-white focus:outline-hidden focus:border-red-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Message</label>
          <textarea
            required
            rows={3}
            value={ticketMessage}
            onChange={(e) => setTicketMessage(e.target.value)}
            placeholder="Describe your issue or UTR reference number..."
            className="w-full px-3 py-2 rounded-xl border border-amber-300 text-xs text-slate-900 bg-white focus:outline-hidden focus:border-red-500"
          />
        </div>

        <button
          type="submit"
          id="btn-submit-support-ticket"
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-xs shadow-md transition-all active:scale-[0.98] cursor-pointer min-h-[44px] flex items-center justify-center gap-2 border border-yellow-300"
        >
          <Send className="w-4 h-4 text-yellow-300" />
          <span>Send Ticket to Priority Support</span>
        </button>
      </form>
    </div>
  );
};
