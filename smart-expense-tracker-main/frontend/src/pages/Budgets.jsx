import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { PiggyBank, Calendar, Plus, Trash2, AlertTriangle, CheckCircle2, DollarSign } from 'lucide-react';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [currentStatus, setCurrentStatus] = useState(null);
  
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const [budgetsRes, statusRes] = await Promise.all([
        API.get('/budgets'),
        API.get(`/budgets/status?month=${selectedMonth}&year=${selectedYear}`)
      ]);
      setBudgets(budgetsRes.data.data || []);
      setCurrentStatus(statusRes.data.data || null);
    } catch (err) {
      console.error('Failed to fetch budgets data', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedMonth, selectedYear]);

  const handleSaveBudget = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid budget amount');
      return;
    }

    setLoading(true);
    try {
      await API.post('/budgets', {
        month: parseInt(selectedMonth),
        year: parseInt(selectedYear),
        amount: parseFloat(amount)
      });
      setAmount('');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save budget');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBudget = async (id) => {
    if (!window.confirm('Delete this budget target?')) return;
    try {
      await API.delete(`/budgets/${id}`);
      fetchData();
    } catch (err) {
      alert('Failed to delete budget record');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 glass-card p-6 rounded-3xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Monthly Budget Management</h1>
          <p className="text-xs text-slate-400 mt-1">Set spending thresholds per month and monitor utilization targets.</p>
        </div>
        <div className="flex items-center gap-2">
          <PiggyBank className="w-8 h-8 text-indigo-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Set Budget Form */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-indigo-400" />
            <span>Set / Update Target Budget</span>
          </h2>

          <form onSubmit={handleSaveBudget} className="space-y-4">
            
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Month</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {MONTH_NAMES.map((m, idx) => (
                  <option key={m} value={idx + 1}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {[2024, 2025, 2026, 2027].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Budget Amount ($)</label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 1500.00"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
            >
              {loading ? 'Saving Budget...' : 'Save Monthly Budget'}
            </button>

          </form>
        </div>

        {/* Live Active Status Card */}
        <div className="lg:col-span-2 glass-card p-6 rounded-3xl border border-slate-800 space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Budget Status: {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
                </h3>
                <p className="text-xs text-slate-400">Live expense consumption report</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                currentStatus?.status === 'EXCEEDED'
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  : currentStatus?.status === 'WARNING'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              }`}>
                {currentStatus?.status || 'NORMAL'}
              </span>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="text-[11px] font-medium text-slate-400">Budget Limit</span>
                <p className="text-xl font-bold text-white mt-1">${currentStatus?.budgetAmount?.toFixed(2) || '0.00'}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="text-[11px] font-medium text-slate-400">Total Spent</span>
                <p className="text-xl font-bold text-slate-200 mt-1">${currentStatus?.totalSpent?.toFixed(2) || '0.00'}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="text-[11px] font-medium text-slate-400">Remaining</span>
                <p className={`text-xl font-bold mt-1 ${
                  (currentStatus?.remainingBudget || 0) < 0 ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  ${currentStatus?.remainingBudget?.toFixed(2) || '0.00'}
                </p>
              </div>
            </div>

            {/* Gauge Bar */}
            {currentStatus && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Utilization Level</span>
                  <span className="font-bold">{currentStatus.utilizationPercentage.toFixed(1)}%</span>
                </div>
                <div className="w-full h-4 bg-slate-900 rounded-full p-0.5 border border-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      currentStatus.utilizationPercentage > 100
                        ? 'bg-rose-500'
                        : currentStatus.utilizationPercentage >= 80
                        ? 'bg-amber-500'
                        : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                    }`}
                    style={{ width: `${Math.min(currentStatus.utilizationPercentage, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-indigo-400" />
            <span>Budgets dynamically sync with all newly added or modified transactions in real-time.</span>
          </div>

        </div>

      </div>

      {/* Historical Budgets List */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800">
        <h3 className="text-sm font-bold text-white mb-4">Saved Monthly Budget Targets</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] text-slate-400 uppercase bg-slate-900/60 border-b border-slate-800">
              <tr>
                <th className="px-6 py-3.5">Month / Year</th>
                <th className="px-6 py-3.5">Budget Limit</th>
                <th className="px-6 py-3.5">Created Date</th>
                <th className="px-6 py-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {budgets.length > 0 ? (
                budgets.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-3.5 font-semibold text-slate-200">
                      {MONTH_NAMES[b.month - 1]} {b.year}
                    </td>
                    <td className="px-6 py-3.5 font-bold text-indigo-400">${b.amount.toFixed(2)}</td>
                    <td className="px-6 py-3.5 text-slate-400">{b.createdAt?.split('T')[0]}</td>
                    <td className="px-6 py-3.5 text-center">
                      <button
                        onClick={() => handleDeleteBudget(b.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                    No budget target records saved yet.
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

export default Budgets;
