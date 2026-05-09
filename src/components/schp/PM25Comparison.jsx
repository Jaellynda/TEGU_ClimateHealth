import React from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, AlertTriangle } from 'lucide-react';

// Generate May data for current year and last year (same month)
function generateComparisonData(schoolId) {
  const seed = schoolId.charCodeAt(1);
  const data = [];
  
  for (let day = 1; day <= 31; day++) {
    const dayFactor = day / 31;
    const noise = Math.sin(day * seed) * 15 + Math.cos(day * 1.3) * 10;
    const lastYearNoise = Math.sin(day * (seed - 1)) * 12 + Math.cos(day * 1.5) * 8;
    
    // Current year trend: worsening
    const currentYear = Math.max(20, Math.round(45 + dayFactor * 85 + noise));
    
    // Last year trend: more stable
    const lastYear = Math.max(20, Math.round(35 + dayFactor * 50 + lastYearNoise));
    
    data.push({
      day: `May ${day}`,
      current: currentYear,
      lastYear: lastYear,
      change: currentYear - lastYear,
    });
  }
  
  return data;
}

export default function PM25Comparison({ schoolId, schoolName }) {
  const data = generateComparisonData(schoolId);
  const currentAvg = Math.round(data.reduce((sum, d) => sum + d.current, 0) / data.length);
  const lastYearAvg = Math.round(data.reduce((sum, d) => sum + d.lastYear, 0) / data.length);
  const trend = currentAvg > lastYearAvg ? 'worsening' : 'improving';
  const changePercent = Math.round(((currentAvg - lastYearAvg) / lastYearAvg) * 100);

  return (
    <div className="bg-white rounded-xl border border-border shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[14px] font-semibold text-[#1B4F72] flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            PM2.5 Year-over-Year Comparison
          </h3>
          <p className="text-[11px] text-muted-foreground mt-1">May 2025 vs May 2026 — Same month comparison</p>
        </div>
        <div className="text-right">
          <p className="text-[12px] font-semibold text-foreground">
            {trend === 'worsening' ? (
              <span className="text-red-600">↑ Worsening by {changePercent}%</span>
            ) : (
              <span className="text-green-600">↓ Improving by {Math.abs(changePercent)}%</span>
            )}
          </p>
          <p className="text-[10px] text-muted-foreground">Current: {currentAvg} vs Last Year: {lastYearAvg} μg/m³</p>
        </div>
      </div>

      {/* Alert box if worsening */}
      {trend === 'worsening' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-red-700">
            <strong>Climate Impact Alert:</strong> Air quality is deteriorating compared to last year. Consider increasing dispatch frequency and monitoring respiratory health closely.
          </p>
        </div>
      )}

      {/* Comparison Chart */}
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis 
            dataKey="day" 
            tick={{ fontSize: 9 }} 
            tickFormatter={(val, i) => i % 5 === 0 ? val : ''}
          />
          <YAxis 
            tick={{ fontSize: 9 }} 
            label={{ value: 'PM2.5 μg/m³', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#666', dy: 40 }}
            domain={[0, 200]}
          />
          <Tooltip 
            contentStyle={{ fontSize: 12 }}
            formatter={(val) => `${val} μg/m³`}
            labelFormatter={(label) => `${label}`}
          />
          <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
          <ReferenceLine y={150} stroke="#C0392B" strokeDasharray="4 3" label={{ value: 'Alert (150)', fontSize: 9, fill: '#C0392B', position: 'right' }} />
          <Bar dataKey="lastYear" name="May 2025 (Last Year)" fill="#94a3b8" fillOpacity={0.6} radius={[2, 2, 0, 0]} />
          <Line 
            type="monotone" 
            dataKey="current" 
            name="May 2026 (Current)" 
            stroke="#1B4F72" 
            strokeWidth={2.5}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        <div className="bg-muted/30 rounded-lg p-2.5">
          <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Current Avg</p>
          <p className="text-[15px] font-bold text-[#1B4F72] mt-1">{currentAvg}</p>
        </div>
        <div className="bg-muted/30 rounded-lg p-2.5">
          <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Last Year Avg</p>
          <p className="text-[15px] font-bold text-slate-600 mt-1">{lastYearAvg}</p>
        </div>
        <div className={`rounded-lg p-2.5 ${trend === 'worsening' ? 'bg-red-50' : 'bg-green-50'}`}>
          <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Trend</p>
          <p className={`text-[15px] font-bold mt-1 ${trend === 'worsening' ? 'text-red-600' : 'text-green-600'}`}>
            {trend === 'worsening' ? '+' : '-'}{Math.abs(changePercent)}%
          </p>
        </div>
      </div>
    </div>
  );
}