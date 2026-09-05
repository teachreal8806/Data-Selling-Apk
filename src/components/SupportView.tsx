import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MessageSquare, 
  Send, 
  HelpCircle, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink 
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
    <div className="w-full max-w-md mx-auto px-4 py-4 space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          id="btn-support-back"
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 py-1.5 px-2.5 rounded-lg hover:bg-slate-100 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </button>
        <h2 className="text-sm font-bold text-slate-900">Customer Support Desk</h2>
        <div className="w-12" />
      </div>

      {/* Official Telegram Channel Card */}
      <div className="bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-xl">
              ✈️
            </div>
            <div>
              <h3 className="text-sm font-bold">Official Telegram Channel</h3>
              <p className="text-xs text-sky-100">{supportConfig.telegramHandle}</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider">
            Official
          </span>
        </div>

        <p className="text-xs text-sky-100 leading-relaxed">
          Join our official Telegram community for live payout proofs, system announcements, and instant support updates.
        </p>

        <a
          href={supportConfig.telegramLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2.5 px-4 rounded-xl bg-white text-sky-700 hover:bg-sky-50 active:scale-95 font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          <span>Join Telegram Channel ({supportConfig.telegramHandle})</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-70" />
        </a>
      </div>

      {/* WhatsApp Direct Support Card */}
      <div className="bg-emerald-600 text-white rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">
              💬
            </div>
            <div>
              <h3 className="text-sm font-bold">24/7 WhatsApp Helpdesk</h3>
              <p className="text-xs text-emerald-100">{supportConfig.whatsappNumber}</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider">
            Live
          </span>
        </div>

        <p className="text-xs text-emerald-100 leading-relaxed">
          Need instant help with deposits, bank withdrawals, or bandwidth selling? Chat with our team directly.
        </p>

        <a
          href={`https://wa.me/${cleanWhatsApp}?text=Hello%20DataSell%20Support,%20I%20need%20assistance%20with%20my%20account`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2.5 px-4 rounded-xl bg-white text-emerald-700 hover:bg-emerald-50 active:scale-95 font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Chat on WhatsApp ({supportConfig.whatsappNumber})</span>
        </a>
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-blue-600" />
          <span>Frequently Asked Questions</span>
        </h3>

        <div className="space-y-2">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={index} className="border border-slate-100 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full text-left px-3.5 py-2.5 text-xs font-semibold text-slate-800 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {isOpen && (
                  <div className="px-3.5 pb-3 text-xs text-slate-600 bg-slate-50/50 border-t border-slate-100 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Support Ticket Form */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Send an Inquiry Ticket</h3>

        {isSubmitted && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Support ticket submitted! Admin desk will review and update within 15 minutes.</span>
          </div>
        )}

        <form onSubmit={handleSubmitTicket} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Subject</label>
            <input
              type="text"
              required
              value={ticketSubject}
              onChange={(e) => setTicketSubject(e.target.value)}
              placeholder="e.g. Deposit verification, Withdrawal speed, Account inquiry"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Message</label>
            <textarea
              required
              rows={3}
              value={ticketMessage}
              onChange={(e) => setTicketMessage(e.target.value)}
              placeholder="Describe your question or issue in detail..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold text-xs transition-all shadow-xs flex items-center justify-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Ticket to Admin</span>
          </button>
        </form>
      </div>
    </div>
  );
};

