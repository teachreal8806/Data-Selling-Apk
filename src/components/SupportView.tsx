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
  Headphones
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
  email: 'support@datasell.in',
  telegramLink: 'https://t.me/datasell_official',
  telegramHandle: '@datasell_official',
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
      q: 'How do deposits & withdrawals work?',
      a: 'Deposits are made via PhonePe, GPay, Paytm, or any UPI app using the QR Scanner and official UPI ID. Withdrawals are processed instantly to your configured UPI ID.'
    },
    {
      q: 'Is my personal data safe?',
      a: 'Yes, 100%. Our software only shares raw internet bandwidth connectivity. It cannot access your private files, browsing history, passwords, or personal apps.'
    },
    {
      q: 'What is the minimum withdrawal amount?',
      a: 'The minimum withdrawal starts at ₹100. You can withdraw anytime once you reach the balance.'
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
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 py-1.5 px-3 rounded-xl hover:bg-slate-100 transition-all cursor-pointer min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold shadow-xs">
          <Headphones className="w-3.5 h-3.5 text-indigo-600" />
          <span>24/7 Priority Desk</span>
        </div>

        <div className="w-8" />
      </div>

      {/* Support Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-blue-50 border border-indigo-200 p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900">Priority Concierge Support</h2>
            <p className="text-xs text-slate-500 mt-0.5">Instant assistance for UPI deposits & payout clearance</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2">
          <a
            href={`https://wa.me/${cleanWhatsApp}?text=Hello%20DataSell%20Support`}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-all min-h-[44px] shadow-xs"
          >
            <span>WhatsApp Desk</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <a
            href={supportConfig.telegramLink}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-3 rounded-2xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-all min-h-[44px] shadow-xs"
          >
            <span>Telegram Channel</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-md space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-indigo-600" />
          <span>Frequently Asked Questions</span>
        </h3>

        <div className="space-y-2">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div 
                key={index}
                className="border border-slate-200 rounded-2xl overflow-hidden transition-all bg-slate-50/50"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-3.5 text-left text-xs font-bold text-slate-800 flex items-center justify-between gap-2 hover:bg-slate-100 cursor-pointer min-h-[44px]"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-indigo-600 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                </button>
                {isOpen && (
                  <div className="px-3.5 pb-3.5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-2 bg-white">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Ticket Submission Form */}
      <form onSubmit={handleSubmitTicket} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-md space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Create Priority Ticket
        </h3>

        {isSubmitted && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Ticket submitted! Support team will respond shortly.</span>
          </div>
        )}

        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-700">Subject / Category</label>
          <input
            type="text"
            required
            value={ticketSubject}
            onChange={(e) => setTicketSubject(e.target.value)}
            placeholder="e.g. Deposit UTR Verification"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-hidden focus:border-indigo-500"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-700">Description of Issue</label>
          <textarea
            required
            rows={3}
            value={ticketMessage}
            onChange={(e) => setTicketMessage(e.target.value)}
            placeholder="Provide UTR number or payout details..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-hidden focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition-all active:scale-[0.98] cursor-pointer min-h-[44px] flex items-center justify-center gap-2"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Submit Support Ticket</span>
        </button>
      </form>
    </div>
  );
};
