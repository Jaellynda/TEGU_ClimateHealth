import React, { useState } from 'react';
import { MessageCircle, CheckCircle, Send, Phone, ExternalLink, Bell } from 'lucide-react';

// Simulated WhatsApp Business API notification panel
// In production: POST to https://graph.facebook.com/v18.0/{phone_id}/messages with a template message

const SCHOOL_ADMINS = {
  s1: { name: 'Mr. Ssekandi John', phone: '+256 701 234 567', school: 'Kampala Parents School' },
  s2: { name: 'Ms. Nalwanga Grace', phone: '+256 772 345 678', school: 'Jinja Central Primary' },
  s6: { name: 'Mr. Ouma Francis', phone: '+256 755 456 789', school: 'Victoria Nile Primary' },
};

function buildWhatsAppMessage(dispatch) {
  return `🚨 *SENTINEL ALERT — ${dispatch.priority?.toUpperCase()} PRIORITY*\n\n` +
    `School: *${dispatch.school_name}*\n` +
    `Trigger: ${dispatch.trigger_type} — ${dispatch.trigger_value}\n` +
    `Supplies: ${dispatch.supplies?.join(', ')}\n\n` +
    `📋 *AI Forecast:* ${dispatch.morbidity_forecast}\n\n` +
    `✅ Confirm dispatch here:\n` +
    `https://schp.app/dispatch\n\n` +
    `_TEGU Climate-Health Protocol · TEGU Systems — Uganda MOH_`;
}

export default function WhatsAppNotifier({ dispatch, onClose }) {
  const [sent, setSent] = useState({});
  const [sending, setSending] = useState(null);
  const admin = SCHOOL_ADMINS[dispatch?.school_id];
  const message = dispatch ? buildWhatsAppMessage(dispatch) : '';

  const handleSend = async (recipientKey) => {
    setSending(recipientKey);
    // Simulate API call delay (in production: WhatsApp Business API)
    await new Promise(r => setTimeout(r, 1200));
    setSent(prev => ({ ...prev, [recipientKey]: new Date().toLocaleTimeString('en-UG', { timeZone: 'Africa/Kampala' }) }));
    setSending(null);
  };

  const recipients = [
    { key: 'admin', label: admin?.name || 'School Admin', phone: admin?.phone || '+256 7XX XXX XXX', role: 'School Principal' },
    { key: 'dhw', label: 'District Health Worker', phone: '+256 782 567 890', role: 'Kampala DHO' },
    { key: 'moh', label: 'MOH Alert Line', phone: '+256 800 100 066', role: 'Uganda MOH Duty Officer' },
  ];

  return (
    <div className="bg-white rounded-xl border border-border shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-[#25D366] px-4 py-3 flex items-center gap-3">
        <MessageCircle className="w-5 h-5 text-white" />
        <div className="flex-1">
          <p className="text-white font-bold text-[13px]">WhatsApp Alert Dispatch</p>
          <p className="text-green-100 text-[10px]">WhatsApp Business API · Automated notification</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-white/70 hover:text-white text-[11px]">✕</button>
        )}
      </div>

      {/* Message Preview */}
      <div className="p-4 border-b border-border">
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Message Preview</p>
        <div className="bg-[#DCF8C6] rounded-xl rounded-tl-none p-3 max-w-xs text-[12px] text-gray-800 whitespace-pre-line leading-relaxed font-mono shadow-sm">
          {message}
        </div>
        <div className="flex items-center gap-1.5 mt-2 text-[10px] text-muted-foreground">
          <ExternalLink className="w-3 h-3" />
          <span>Deep link → /dispatch for one-tap confirmation</span>
        </div>
      </div>

      {/* Recipients */}
      <div className="p-4 space-y-2">
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-3">Send To</p>
        {recipients.map(r => (
          <div key={r.key} className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${sent[r.key] ? 'bg-green-50 border-green-200' : 'bg-muted/30 border-border'}`}>
            <div className="w-8 h-8 rounded-full bg-[#1B4F72] flex items-center justify-center flex-shrink-0">
              <Phone className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold text-foreground">{r.label}</p>
              <p className="text-[10px] text-muted-foreground">{r.phone} · {r.role}</p>
              {sent[r.key] && (
                <p className="text-[10px] text-green-600 font-medium mt-0.5">✓ Sent at {sent[r.key]} EAT</p>
              )}
            </div>
            {sent[r.key] ? (
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            ) : (
              <button
                disabled={sending === r.key}
                onClick={() => handleSend(r.key)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] hover:bg-[#1EA952] text-white text-[11px] font-semibold rounded-lg transition-colors disabled:opacity-60 flex-shrink-0"
              >
                <Send className="w-3 h-3" />
                {sending === r.key ? '...' : 'Send'}
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="px-4 pb-4">
        <p className="text-[10px] text-muted-foreground bg-muted/40 rounded-lg p-2.5 leading-relaxed">
          <strong>Production note:</strong> Messages sent via WhatsApp Business API (Meta Graph API v18+). Template ID: <code className="font-mono">sentinel_alert_v1</code>. In prototype, notifications are simulated. Each message includes a deep link to <code className="font-mono">/dispatch</code> for one-tap status confirmation.
        </p>
      </div>
    </div>
  );
}