import React, { useState } from "react";
import { Bell, Send, Mail, Radio, Clock, CheckCircle, History, AlertCircle } from "lucide-react";

interface NotificationCenterProps {
  notifications: any[];
  token: string;
  onRefresh: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ notifications, token, onRefresh }) => {
  const [type, setType] = useState<"Announcement" | "Push Notification" | "Email Broadcast">("Announcement");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [isScheduled, setIsScheduled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;

    setLoading(true);
    setSentSuccess(false);

    try {
      const res = await fetch("/api/admin/notifications/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token,
        },
        body: JSON.stringify({
          type,
          title,
          message,
          ...(isScheduled && { scheduledAt: scheduleDate }),
        }),
      });

      if (res.ok) {
        setTitle("");
        setMessage("");
        setSentSuccess(true);
        setTimeout(() => setSentSuccess(false), 3000);
        onRefresh();
      }
    } catch (err) {
      console.error("Failed to send notification", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl backdrop-blur-xl">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-100 flex items-center gap-2">
            <Bell className="w-6 h-6 text-amber-400" />
            <span>Broadcast Notification Center</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Dispatch in-app announcement banners, mobile push notifications, and email broadcasts to subscribers.
          </p>
        </div>
      </div>

      {sentSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span>Broadcast dispatched successfully to all targeted users!</span>
        </div>
      )}

      {/* Broadcast Form */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">Notification Channel</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "In-App Banner", val: "Announcement", icon: Radio },
                { label: "Push Notification", val: "Push Notification", icon: Bell },
                { label: "Email Broadcast", val: "Email Broadcast", icon: Mail },
              ].map((item, idx) => {
                const IconComp = item.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setType(item.val as any)}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-medium transition-all ${
                      type === item.val
                        ? "bg-amber-500/10 border-amber-500 text-amber-300"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <IconComp className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Broadcast Subject / Headline</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g. Special Full Moon Transit Forecast Available"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Message Body</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={4}
              placeholder="Write broadcast message content..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <div className="flex items-center gap-4 pt-2">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isScheduled}
                onChange={(e) => setIsScheduled(e.target.checked)}
                className="rounded accent-amber-500 bg-slate-950"
              />
              <span>Schedule for Future Dispatch</span>
            </label>

            {isScheduled && (
              <input
                type="datetime-local"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200"
              />
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-semibold text-sm rounded-xl hover:from-amber-400 hover:to-amber-500 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{isScheduled ? "Schedule Notification" : "Dispatch Broadcast Now"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Broadcast History Table */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
        <h3 className="text-base font-bold text-slate-100 mb-4 flex items-center gap-2">
          <History className="w-5 h-5 text-amber-400" />
          <span>Notification Dispatch Log</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-mono uppercase">
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4">Headline</th>
                <th className="py-3 px-4">Recipients</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Dispatch Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {(Array.isArray(notifications) ? notifications : []).map((notif) => (
                <tr key={notif.id} className="hover:bg-slate-800/30">
                  <td className="py-3 px-4 font-semibold text-amber-300">{notif.type}</td>
                  <td className="py-3 px-4 text-slate-200 max-w-xs truncate">{notif.title}</td>
                  <td className="py-3 px-4 font-mono text-slate-300">{notif.recipientsCount} users</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {notif.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500">{new Date(notif.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
