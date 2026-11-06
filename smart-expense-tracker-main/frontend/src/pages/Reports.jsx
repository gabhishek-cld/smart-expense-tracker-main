import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { 
  BarChart3, FileSpreadsheet, FileText, Download, Calendar, 
  TrendingUp, PieChart as PieIcon, DollarSign, Award
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#14b8a6'];

const Reports = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [report, setReport] = useState(null);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const [reportRes, trendsRes] = await Promise.all([
        API.get(`/reports/monthly?month=${selectedMonth}&year=${selectedYear}`),
        API.get('/reports/spending-trends?months=6')
      ]);
      setReport(reportRes.data.data);
      setTrends(trendsRes.data.data || []);
    } catch (err) {
      console.error('Failed to fetch monthly report', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [selectedMonth, selectedYear]);

  const handleExportCsv = async () => {
    try {
      const response = await API.get('/reports/export/csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `expenses_report_${selectedYear}_${selectedMonth}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to export CSV report');
    }
  };

  const handleExportPdf = async () => {
    try {
      const response = await API.get(`/reports/export/pdf?month=${selectedMonth}&year=${selectedYear}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `monthly_expense_report_${selectedYear}_${selectedMonth}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to export PDF report');
    }
  };

  const categoryBarData = report?.categorySummaries?.map(c => ({
    name: c.category,
    amount: c.totalAmount
  })) || [];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 glass-card p-6 rounded-3xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Financial Reports & Analytics</h1>
          <p className="text-xs text-slate-400 mt-1">Deep analytics, category distribution, and downloadable statements.</p>
        </div>

        {/* Month Selector Controls */}
        <div className="flex items-center gap-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
          >
            {MONTH_NAMES.map((m, idx) => (
              <option key={m} value={idx + 1}>{m}</option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
          >
            {[2024, 2025, 2026, 2027].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Export Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass-card p-4 rounded-2xl border border-slate-800">
        <span className="text-xs font-semibold text-slate-300">
          Statement Period: {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCsv}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-2 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleExportPdf}
            className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
          >
            <FileText className="w-4 h-4 text-white" />
            <span>Download PDF Report</span>
          </button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-xs font-medium text-slate-400">Total Expenses</span>
          <p className="text-2xl font-black text-white mt-2">${report?.totalExpenses?.toFixed(2) || '0.00'}</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-xs font-medium text-slate-400">Average Daily Spend</span>
          <p className="text-2xl font-black text-indigo-400 mt-2">${report?.averageDailySpending?.toFixed(2) || '0.00'}</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-xs font-medium text-slate-400">Highest Category</span>
          <p className="text-lg font-bold text-emerald-400 mt-2 truncate">{report?.highestSpendingCategory || 'N/A'}</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-xs font-medium text-slate-400">Lowest Category</span>
          <p className="text-lg font-bold text-amber-400 mt-2 truncate">{report?.lowestSpendingCategory || 'N/A'}</p>
        </div>

      </div>

      {/* Bar Chart: Category Breakdown */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800">
        <h3 className="text-sm font-bold text-white mb-4">Category-Wise Spending Breakdown</h3>

        <div className="h-64 w-full">
          {categoryBarData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryBarData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  formatter={(val) => [`$${val.toFixed(2)}`, 'Amount']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                  {categoryBarData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-xs text-slate-500 italic flex items-center justify-center h-full">No category spending data for this period</p>
          )}
        </div>
      </div>

      {/* Category Breakdown Table */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800">
        <h3 className="text-sm font-bold text-white mb-4">Category Breakdown Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] text-slate-400 uppercase bg-slate-900/60 border-b border-slate-800">
              <tr>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Total Spent</th>
                <th className="px-6 py-3.5">Percentage Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {report?.categorySummaries?.length > 0 ? (
                report.categorySummaries.map((cat) => (
                  <tr key={cat.category} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-3.5 font-semibold text-slate-200">{cat.category}</td>
                    <td className="px-6 py-3.5 font-bold text-slate-100">${cat.totalAmount.toFixed(2)}</td>
                    <td className="px-6 py-3.5 text-indigo-400 font-semibold">{cat.percentage.toFixed(1)}%</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-slate-500">
                    No breakdown data recorded for this month.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Reports;
