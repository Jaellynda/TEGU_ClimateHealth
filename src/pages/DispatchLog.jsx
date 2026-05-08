import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DISPATCH_LOGS } from '@/lib/schpData';
import { useAdminAuth } from '@/lib/authContext';
import {
  Package, CheckCircle, Clock, Truck, ChevronDown, ChevronUp,
  Lock, Brain, Send, MapPin, Square, CheckSquare, Zap, X
} from 'lucide-react';

const STATUS_CONFIG = {
  Pending:     { color: 'text-yellow-700', bg: 'bg-yellow-100', border: 'border-yellow-200', icon: Clock },
  Dispatched:  { color: 'text-blue-700',   bg: 'bg-blue-100',   border: 'border-blue-200',   icon: Truck },
  Delivered:   { color: 'text-green-700',  bg: 'bg-green-100',  border: 'border-green-200',  icon: CheckCircle },
  Acknowledged:{ color: 'text-purple-700', bg: 'bg-purple-100', border: 'border-purple-200', icon: CheckCircle },
};

const PRIORITY_CONFIG = {
  Critical: { badge: 'bg-red-100 text-red-700 border-red-200' },
  High:     { badge: 'bg-orange-100 text-orange-700 border-orange-200' },
  Medium:   { badge: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
};

function DispatchCard({ dispatch, onStatusChange, selected, onToggleSelect }) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  const status = STATUS_CONFIG[dispatch.status] || STATUS_CONFIG.Pending;
  const priority = PRIORITY_CONFIG[dispatch.priority] || PRIORITY_CONFIG.Medium;
  const StatusIcon = status.icon;

  const handleAction = async (newStatus) => {
    setLoading(true);
    const dispatchedBy = newStatus === 'Dispatched'
      ? `Health Worker · ${new Date().toLocaleString('en-UG', { timeZone: 'Africa/Kampala' })} EAT`
      : dispatch.dispatched_by;
    await onStatusChange(dispatch.id, { status: newStatus, dispatched_by: dispatchedBy });
    setLoading(false);
  };

  return (
    <div className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all ${selected ? 'border-[#1B4F72] ring-2 ring-[#1B4F72]/20' : 'border-border'}`}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <button
            onClick={() => onToggleSelect(dispatch.id)}
            className="mt-0.5 flex-shrink-0 text-muted-foreground hover:text-[#1B4F72] transition-colors"
          >
            {selected
              ? <CheckSquare className="w-5 h-5 text-[#1B4F72]" />
              : <Square className="w-5 h-5" />}
          </button>

          <div className="flex items-start justify-between gap-3 flex-1 min-w-0">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-[#1B4F72]/10 flex items-center justify-center flex-shrink-0">
                <Package className="w-4 h-4 text-[#1B4F72]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                  <p className="text-[14px] font-bold text-[#1B4F72]">{dispatch.school_name}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${priority.badge}`}>{dispatch.priority}</span>
                </div>
                <p className="text-[12px] text-muted-foreground">{dispatch.district} · {dispatch.trigger_type}</p>
                <p className="text-[11px] text-muted-foreground/70 mt-0.5">Trigger: {dispatch.trigger_value}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${status.bg} ${status.border}`}>
                <StatusIcon className={`w-3.5 h-3.5 ${status.color}`} />
                <span className={`text-[11px] font-semibold ${status.color}`}>{dispatch.status}</span>
              </div>
              <button onClick={() => setExpanded(!expanded)} className="text-muted-foreground hover:text-foreground transition-colors">
                {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Supplies */}
        <div className="mt-3 ml-8 flex flex-wrap gap-1.5">
          {dispatch.supplies?.map((s, i) => (
            <span key={i} className="text-[11px] bg-muted text-muted-foreground px-2.5 py-1 rounded-full border border-border">
              {s}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-3 ml-8 flex gap-2">
          {dispatch.status === 'Pending' && (
            <button
              disabled={loading}
              onClick={() => handleAction('Dispatched')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-semibold transition-colors disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              {loading ? 'Updating...' : 'Mark as Dispatched'}
            </button>
          )}
          {dispatch.status === 'Dispatched' && (
            <button
              disabled={loading}
              onClick={() => handleAction('Delivered')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-[12px] font-semibold transition-colors disabled:opacity-50"
            >
              <MapPin className="w-3.5 h-3.5" />
              {loading ? 'Updating...' : 'Confirm Delivery'}
            </button>
          )}
          {dispatch.status === 'Delivered' && (
            <div className="flex items-center gap-1.5 text-[12px] text-green-700 font-medium">
              <CheckCircle className="w-4 h-4" />
              Delivered & logged · {dispatch.dispatched_by}
            </div>
          )}
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
          <div className="bg-[#1B4F72]/5 rounded-lg p-3 border border-[#1B4F72]/10">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Brain className="w-3.5 h-3.5 text-[#E67E22]" />
              <span className="text-[11px] font-semibold text-[#E67E22] uppercase tracking-wide">XAI Reason</span>
            </div>
            <p className="text-[12px] text-foreground leading-relaxed">{dispatch.xai_reason}</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
            <p className="text-[11px] font-semibold text-[#E67E22] uppercase tracking-wide mb-1">Morbidity Forecast</p>
            <p className="text-[12px] text-orange-900">{dispatch.morbidity_forecast}</p>
          </div>
          <div className="text-[11px] text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 pt-1">
            <span>ID: <code className="bg-muted px-1 rounded font-mono">{dispatch.id?.toUpperCase()}</code></span>
            <span>By: {dispatch.dispatched_by}</span>
            {dispatch.created_date && (
              <span>Created: {new Date(dispatch.created_date).toLocaleString('en-UG', { timeZone: 'Africa/Kampala' })} EAT</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function BulkDispatchBar({ selected, dispatches, onBulkDispatch, onClear }) {
  const [loading, setLoading] = useState(false);
  const selectedDispatches = dispatches.filter(d => selected.has(d.id));
  const pendingCount = selectedDispatches.filter(d => d.status === 'Pending').length;

  // Merge all unique supplies across selected
  const allSupplies = [...new Set(selectedDispatches.flatMap(d => d.supplies || []))];

  const handle = async () => {
    setLoading(true);
    await onBulkDispatch(selectedDispatches.filter(d => d.status === 'Pending').map(d => d.id));
    setLoading(false);
    onClear();
  };

  return (
    <div className="bg-[#1B4F72] text-white rounded-xl p-4 flex flex-wrap items-center gap-4 shadow-lg">
      <div className="flex items-center gap-2">
        <Zap className="w-5 h-5 text-[#E67E22]" />
        <span className="text-[14px] font-bold">{selected.size} school{selected.size !== 1 ? 's' : ''} selected</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-blue-200 mb-1">Combined supplies for bulk dispatch:</p>
        <div className="flex flex-wrap gap-1.5">
          {allSupplies.slice(0, 6).map((s, i) => (
            <span key={i} className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">{s}</span>
          ))}
          {allSupplies.length > 6 && <span className="text-[10px] text-blue-300">+{allSupplies.length - 6} more</span>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {pendingCount > 0 && (
          <button
            disabled={loading}
            onClick={handle}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#E67E22] hover:bg-[#D35400] text-white text-[12px] font-bold transition-colors disabled:opacity-60"
          >
            <Send className="w-3.5 h-3.5" />
            {loading ? 'Dispatching...' : `Bulk Dispatch (${pendingCount} pending)`}
          </button>
        )}
        <button onClick={onClear} className="text-white/60 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default function DispatchLog() {
  const { isAdmin, login } = useAdminAuth();
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(new Set());
  const queryClient = useQueryClient();

  const { data: dbLogs = [], isLoading } = useQuery({
    queryKey: ['dispatchLogs'],
    queryFn: async () => {
      const existing = await base44.entities.DispatchLog.list('-created_date', 50);
      if (existing.length === 0) {
        await base44.entities.DispatchLog.bulkCreate(DISPATCH_LOGS.map(d => ({
          school_id: d.school_id, school_name: d.school_name, district: d.district,
          trigger_type: d.trigger_type, trigger_value: d.trigger_value, supplies: d.supplies,
          status: d.status, xai_reason: d.xai_reason, morbidity_forecast: d.morbidity_forecast,
          priority: d.priority, dispatched_by: d.dispatched_by,
        })));
        return base44.entities.DispatchLog.list('-created_date', 50);
      }
      return existing;
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.DispatchLog.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['dispatchLogs'] }),
  });

  const handleToggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map(d => d.id)));
    }
  };

  const handleBulkDispatch = async (ids) => {
    const dispatchedBy = `Health Worker · ${new Date().toLocaleString('en-UG', { timeZone: 'Africa/Kampala' })} EAT`;
    await Promise.all(ids.map(id => updateMutation.mutateAsync({ id, data: { status: 'Dispatched', dispatched_by: dispatchedBy } })));
  };

  const statusFilters = ['All', 'Pending', 'Dispatched', 'Delivered'];
  const filtered = filter === 'All' ? dbLogs : dbLogs.filter(d => d.status === filter);
  const countByStatus = (s) => dbLogs.filter(d => d.status === s).length;
  const allSelected = filtered.length > 0 && selected.size === filtered.length;

  if (!isAdmin) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-[#1B4F72]/10 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7 text-[#1B4F72]" />
          </div>
          <h2 className="text-[20px] font-bold text-[#1B4F72] mb-2">Admin Access Required</h2>
          <p className="text-muted-foreground text-[13px] mb-5">This view is restricted to verified health workers and district administrators.</p>
          <button onClick={login} className="bg-[#E67E22] hover:bg-[#D35400] text-white font-semibold px-6 py-2.5 rounded-lg transition-colors">
            Login as Health Worker
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#E67E22] to-[#D35400] rounded-xl p-5 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Truck className="w-6 h-6" />
          <h2 className="text-[18px] font-bold">Anticipatory Action Dispatch Log</h2>
        </div>
        <p className="text-orange-100 text-[13px]">Admin View · Supply chain management · Sentinel Engine auto-dispatches</p>
        <div className="flex flex-wrap gap-3 mt-3">
          {[
            { label: 'Total Orders', value: dbLogs.length },
            { label: 'Pending', value: countByStatus('Pending') },
            { label: 'Dispatched', value: countByStatus('Dispatched') },
            { label: 'Delivered', value: countByStatus('Delivered') },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white/20 rounded-lg px-3 py-1.5">
              <span className="text-[11px] opacity-80">{label}: </span>
              <span className="text-[14px] font-bold">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters + Select All */}
      <div className="flex flex-wrap items-center gap-2">
        {statusFilters.map(f => (
          <button key={f} onClick={() => { setFilter(f); setSelected(new Set()); }}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all ${
              filter === f ? 'bg-[#1B4F72] text-white' : 'bg-white text-muted-foreground border border-border hover:border-[#1B4F72]'
            }`}>
            {f}
          </button>
        ))}
        <button
          onClick={handleSelectAll}
          className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-medium bg-white border border-border hover:border-[#1B4F72] text-muted-foreground transition-all"
        >
          {allSelected ? <CheckSquare className="w-4 h-4 text-[#1B4F72]" /> : <Square className="w-4 h-4" />}
          {allSelected ? 'Deselect All' : 'Select All'}
        </button>
      </div>

      {/* Bulk dispatch bar */}
      {selected.size > 0 && (
        <BulkDispatchBar
          selected={selected}
          dispatches={dbLogs}
          onBulkDispatch={handleBulkDispatch}
          onClear={() => setSelected(new Set())}
        />
      )}

      {/* Cards */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground text-[13px]">Loading dispatch orders...</div>
      ) : (
        <div className="space-y-3">
          {filtered.map(dispatch => (
            <DispatchCard
              key={dispatch.id}
              dispatch={dispatch}
              selected={selected.has(dispatch.id)}
              onToggleSelect={handleToggleSelect}
              onStatusChange={(id, data) => updateMutation.mutateAsync({ id, data })}
            />
          ))}
        </div>
      )}
    </div>
  );
}