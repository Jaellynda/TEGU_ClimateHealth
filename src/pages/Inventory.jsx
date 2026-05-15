import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DISPATCH_LOGS } from '@/lib/schpData';
import { useAdminAuth } from '@/lib/AuthContext';
import {
  Package, AlertTriangle, CheckCircle, Plus, Minus, Lock,
  ShoppingCart, Info, Search, X
} from 'lucide-react';

const DEFAULT_INVENTORY = [
  { item_name: 'Pediatric N95 Masks', category: 'Respiratory', unit: 'units', stock: 1200, min_stock: 300, unit_cost: 0.85 },
  { item_name: 'Salbutamol Inhalers', category: 'Respiratory', unit: 'units', stock: 180, min_stock: 80, unit_cost: 4.50 },
  { item_name: 'Oral Rehydration Salts', category: 'Hydration', unit: 'sachets', stock: 850, min_stock: 200, unit_cost: 0.20 },
  { item_name: 'Electrolyte Sachets', category: 'Hydration', unit: 'units', stock: 420, min_stock: 100, unit_cost: 0.35 },
  { item_name: 'Cooling Packs', category: 'Heat Management', unit: 'units', stock: 95, min_stock: 50, unit_cost: 2.10 },
  { item_name: 'Antihistamines (Cetirizine)', category: 'Allergy', unit: 'tablets', stock: 2400, min_stock: 500, unit_cost: 0.05 },
  { item_name: 'Eye Wash Stations', category: 'Eye Care', unit: 'units', stock: 12, min_stock: 5, unit_cost: 35.00 },
  { item_name: 'Disposable Gloves (Box)', category: 'PPE', unit: 'boxes', stock: 48, min_stock: 20, unit_cost: 6.50 },
];

function StockBar({ stock, min_stock, max }) {
  const pct = Math.min(100, (stock / max) * 100);
  const low = stock <= min_stock;
  const critical = stock <= min_stock * 0.5;
  const color = critical ? '#C0392B' : low ? '#E67E22' : '#1E8449';
  return (
    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
    </div>
  );
}

function InventoryCard({ item, onAdjust }) {
  const [delta, setDelta] = useState('');
  const low = item.stock <= item.min_stock;
  const critical = item.stock <= item.min_stock * 0.5;

  const handleAdjust = (dir) => {
    const val = parseInt(delta, 10);
    if (!val || val <= 0) return;
    onAdjust(item.id, dir === 'add' ? val : -val);
    setDelta('');
  };

  return (
    <div className={`bg-white rounded-xl border shadow-sm p-4 ${critical ? 'border-red-300' : low ? 'border-orange-300' : 'border-border'}`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold text-foreground">{item.item_name}</p>
          <p className="text-[11px] text-muted-foreground">{item.category}</p>
        </div>
        {critical && (
          <span className="flex-shrink-0 text-[10px] font-bold bg-red-100 text-red-700 border border-red-200 px-2 py-0.5 rounded-full flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Critical Low
          </span>
        )}
        {!critical && low && (
          <span className="flex-shrink-0 text-[10px] font-bold bg-orange-100 text-orange-700 border border-orange-200 px-2 py-0.5 rounded-full">
            Low Stock
          </span>
        )}
        {!low && (
          <span className="flex-shrink-0 text-[10px] font-bold bg-green-100 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">
            In Stock
          </span>
        )}
      </div>

      <div className="flex items-end justify-between mb-2">
        <div>
          <p className="text-2xl font-bold" style={{ color: critical ? '#C0392B' : low ? '#E67E22' : '#1E8449' }}>
            {item.stock.toLocaleString()}
          </p>
          <p className="text-[10px] text-muted-foreground">{item.unit} · Min: {item.min_stock}</p>
        </div>
        <p className="text-[11px] text-muted-foreground">${item.unit_cost?.toFixed(2)}/unit</p>
      </div>

      <StockBar stock={item.stock} min_stock={item.min_stock} max={item.stock * 1.5 + item.min_stock * 2} />

      <div className="flex items-center gap-2 mt-3">
        <input
          type="number"
          min="1"
          value={delta}
          onChange={e => setDelta(e.target.value)}
          placeholder="Qty"
          className="w-16 border border-border rounded-lg px-2 py-1 text-[12px] text-center focus:outline-none focus:border-[#1B4F72]"
        />
        <button
          onClick={() => handleAdjust('add')}
          className="flex items-center gap-1 px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-[11px] font-semibold transition-colors"
        >
          <Plus className="w-3 h-3" /> Restock
        </button>
        <button
          onClick={() => handleAdjust('remove')}
          className="flex items-center gap-1 px-2.5 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-[11px] font-semibold transition-colors"
        >
          <Minus className="w-3 h-3" /> Use
        </button>
      </div>
    </div>
  );
}

function DispatchStockCheck() {
  return (
    <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-[#1B4F72]/5">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-4 h-4 text-[#1B4F72]" />
          <h3 className="text-[13px] font-bold text-[#1B4F72]">Dispatch ↔ Stock Linkage</h3>
        </div>
        <p className="text-[11px] text-muted-foreground mt-0.5">Supplies consumed by each dispatch order</p>
      </div>
      <div className="divide-y divide-border">
        {DISPATCH_LOGS.map(d => (
          <div key={d.id} className="px-4 py-3">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <p className="text-[12px] font-semibold text-foreground">{d.school_name}</p>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                d.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                d.status === 'Dispatched' ? 'bg-blue-100 text-blue-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>{d.status}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {d.supplies?.map((s, i) => (
                <span key={i} className="text-[10px] bg-[#1B4F72]/5 text-[#1B4F72] border border-[#1B4F72]/20 px-2 py-0.5 rounded-full">
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Inventory() {
  const { isAdmin, login } = useAdminAuth();
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data: inventory = [], isLoading } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const { data: existing, error } = await supabase
        .from('inventory')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      if (error) throw error;

      if (existing.length === 0) {
        const { error: insertError } = await supabase
          .from('inventory')
          .insert(DEFAULT_INVENTORY);
        if (insertError) throw insertError;

        const { data: seeded, error: fetchError } = await supabase
          .from('inventory')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);
        if (fetchError) throw fetchError;
        return seeded;
      }

      return existing;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, stock }) => {
      const { error } = await supabase.from('inventory').update({ stock }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['inventory'] }),
  });

  const handleAdjust = (id, delta) => {
    const item = inventory.find(i => i.id === id);
    if (!item) return;
    const newStock = Math.max(0, (item.stock || 0) + delta);
    updateMutation.mutate({ id, stock: newStock });
  };

  if (!isAdmin) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-[#1B4F72]/10 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7 text-[#1B4F72]" />
          </div>
          <h2 className="text-[20px] font-bold text-[#1B4F72] mb-2">Admin Access Required</h2>
          <p className="text-muted-foreground text-[13px] mb-5">Inventory management is restricted to health workers.</p>
          <button onClick={login} className="bg-[#E67E22] hover:bg-[#D35400] text-white font-semibold px-6 py-2.5 rounded-lg transition-colors">
            Login as Health Worker
          </button>
        </div>
      </div>
    );
  }

  const lowCount = inventory.filter(i => i.stock <= i.min_stock).length;
  const critCount = inventory.filter(i => i.stock <= (i.min_stock * 0.5)).length;
  const filtered = inventory.filter(i => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return i.item_name?.toLowerCase().includes(q) || i.category?.toLowerCase().includes(q);
  });

  return (
    <div className="p-4 md:p-6 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1B4F72] to-[#2E86C1] rounded-xl p-5 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Package className="w-6 h-6 text-[#E67E22]" />
          <h2 className="text-[18px] font-bold">Medical Supply Inventory</h2>
        </div>
        <p className="text-blue-200 text-[13px]">Admin · TEGU Systems · Real-time stock tracking linked to dispatch system</p>
        <div className="flex flex-wrap gap-3 mt-3">
          {[
            { label: 'Total Items', value: inventory.length },
            { label: 'Low Stock', value: lowCount, bg: lowCount > 0 ? 'bg-orange-500/30 text-orange-200' : 'bg-white/20' },
            { label: 'Critical', value: critCount, bg: critCount > 0 ? 'bg-red-500/30 text-red-200' : 'bg-white/20' },
            { label: 'Total Dispatches', value: DISPATCH_LOGS.length },
          ].map(({ label, value, bg = 'bg-white/20' }) => (
            <div key={label} className={`${bg} rounded-lg px-3 py-1.5`}>
              <span className="text-[11px] opacity-80">{label}: </span>
              <span className="text-[14px] font-bold">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by supply name or category…"
          className="w-full pl-9 pr-9 py-2.5 border border-border rounded-xl text-[13px] focus:outline-none focus:border-[#1B4F72] bg-white shadow-sm"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Automated restock warnings */}
      {(critCount > 0 || lowCount > 0) && (
        <div className="rounded-xl border overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-600">
            <AlertTriangle className="w-4 h-4 text-white" />
            <span className="text-[13px] font-bold text-white">Restock Warning — Action Required Before Next Dispatch</span>
          </div>
          <div className="divide-y divide-amber-100 bg-amber-50 border border-amber-200 border-t-0 rounded-b-xl">
            {inventory
              .filter(i => i.stock <= i.min_stock)
              .sort((a, b) => (a.stock / a.min_stock) - (b.stock / b.min_stock))
              .map(item => {
                const isCrit = item.stock <= item.min_stock * 0.5;
                return (
                  <div key={item.id} className="flex items-center gap-3 px-4 py-2.5">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isCrit ? 'bg-red-500 animate-pulse' : 'bg-orange-400'}`} />
                    <div className="flex-1 min-w-0">
                      <span className="text-[12px] font-semibold text-foreground">{item.item_name}</span>
                      <span className="text-[11px] text-muted-foreground ml-2">({item.category})</span>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className={`text-[12px] font-bold ${isCrit ? 'text-red-600' : 'text-orange-600'}`}>
                        {item.stock} {item.unit}
                      </span>
                      <span className="text-[10px] text-muted-foreground ml-1">/ min {item.min_stock}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${
                      isCrit ? 'bg-red-100 text-red-700 border-red-200' : 'bg-orange-100 text-orange-700 border-orange-200'
                    }`}>
                      {isCrit ? 'Critical' : 'Low'}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Inventory grid */}
        <div className="xl:col-span-2 space-y-3">
          {isLoading ? (
            <div className="text-center py-10 text-muted-foreground text-[13px]">Loading inventory...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filtered.length === 0 && (
                <div className="col-span-2 text-center py-8 text-muted-foreground text-[13px]">
                  No supplies match "<span className="font-semibold">{search}</span>"
                </div>
              )}
              {filtered.map(item => (
                <InventoryCard key={item.id} item={item} onAdjust={handleAdjust} />
              ))}
            </div>
          )}
        </div>

        {/* Dispatch linkage sidebar */}
        <div className="space-y-4">
          <DispatchStockCheck />
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
            <Info className="w-4 h-4 text-[#1B4F72] flex-shrink-0 mt-0.5" />
            <p className="text-[12px] text-blue-700 leading-relaxed">
              Stock levels are automatically decremented when a dispatch is confirmed as <strong>Delivered</strong>. In production, this integrates with Uganda MOH's national supply chain management system (OpenLMIS).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
