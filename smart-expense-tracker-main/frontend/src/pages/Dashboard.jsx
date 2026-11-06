import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import Modal from '../components/Modal';
import { 
  DollarSign, Wallet, PiggyBank, AlertTriangle, ArrowUpRight, Plus, 
  TrendingUp, PieChart as PieIcon, Calendar, CheckCircle2, ChevronRight, Tag
} from 'lucide-react';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, 
  LineChart, Line, XAxis, YAxis, CartesianGrid 
} from 'recharts';

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#14b8a6', '#8b5cf6', '#64748b'];

const Dashboard = () => {
  const { user } = useAuth();
  const [report, setReport] = useState(null);
  const [budgetStatus, setBudgetStatus] = useState(null);
  const [trends, setTrends] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Expense Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({
    title: '',
    amount: '',
    category: 'Food',
    expenseDate: new Date().toISOString().split('T')[0],
    description: '',
    paymentMethod: 'UPI'
  });
  const [modalLoading, setModalLoading] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();

      const [reportRes, budgetRes, trendsRes, expensesRes] = await Promise.all([
        API.get(`/reports/monthly?month=${month}&year=${year}`),
        API.get(`/budgets/status?month=${month}&year=${year}`),
        API.get('/reports/spending-trends?months=6'),
        API.get('/expenses?page=0&size=5&sortBy=expenseDate&sortDir=desc')
      ]);

      setReport(reportRes.data.data);
      setBudgetStatus(budgetRes.data.data);
      setTrends(trendsRes.data.data);
      setRecentExpenses(expensesRes.data.data.content || []);
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAddExpenseSubmit = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    try {
      await API.post('/expenses', {
        ...newExpense,
        amount: parseFloat(newExpense.amount)
      });
      setIsModalOpen(false);
      setNewExpense({
        title: '',
        amount: '',
        category: 'Food',
        expenseDate: new Date().toISOString().split('T')[0],
        description: '',
        paymentMethod: 'UPI'
      });
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add expense');
    } finally {
      setModalLoading(false);
    }
  };

  const pieData = report?.categorySummaries?.map(cat => ({
    name: cat.category,
    value: cat.totalAmount
  })) || [];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 glass-card p-6 rounded-3xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white">
            Welcome back, <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{user?.name}</span> 👋
          </h1>
          <p className="text-xs text-slate-400 mt-1">Here is your financial overview and monthly spending activity.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-3 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Expense</span>
        </button>
      </div>

      {/* Budget Status Alert Banner */}
      {budgetStatus && budgetStatus.status !== 'NOT_SET' && (
        <div className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-medium transition-all ${
          budgetStatus.status === 'EXCEEDED'
            ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            : budgetStatus.status === 'WARNING'
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
        }`}>
          <div className="flex items-center gap-3">
            <AlertTriangle className={`w-5 h-5 shrink-0 ${
              budgetStatus.status === 'EXCEEDED' ? 'text-rose-400' : budgetStatus.status === 'WARNING' ? 'text-amber-400' : 'text-emerald-400'
            }`} />
            <span>{budgetStatus.message}</span>
          </div>
          <span className="font-bold">{String(budgetStatus.utilizationPercentage.toFixed(1))}% Used</span>
        </div>
      )}

      {/* Metrics Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Spent */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 relative overflow-hidden group hover:border-indigo-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Current Month Spent</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/15 flex items-center justify-center text-indigo-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-3">${report?.totalExpenses?.toFixed(2) || '0.00'}</p>
          <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-2">
            <span>{report?.totalTransactions || 0} transactions logged</span>
          </div>
        </div>

        {/* Card 2: Monthly Budget */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 relative overflow-hidden group hover:border-purple-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Monthly Budget</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/15 flex items-center justify-center text-purple-400">
              <PiggyBank className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-3">${report?.monthlyBudget?.toFixed(2) || '0.00'}</p>
          <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-2">
            <span>Limit set for this month</span>
          </div>
        </div>

        {/* Card 3: Remaining Budget */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 relative overflow-hidden group hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Remaining Budget</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <p className={`text-2xl font-black mt-3 ${
            (report?.remainingBudget || 0) < 0 ? 'text-rose-400' : 'text-emerald-400'
          }`}>
            ${report?.remainingBudget?.toFixed(2) || '0.00'}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-2">
            <span>Available funds</span>
          </div>
        </div>

        {/* Card 4: Top Category */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 relative overflow-hidden group hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Highest Category</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400">
              <Tag className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xl font-bold text-white mt-3 truncate">{report?.highestSpendingCategory || 'N/A'}</p>
          <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-2">
            <span>Top expense category</span>
          </div>
        </div>

      </div>

      {/* Budget Utilization Progress Card */}
      {budgetStatus && budgetStatus.budgetAmount > 0 && (
        <div className="glass-card p-6 rounded-3xl border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Monthly Budget Progress</h3>
              <p className="text-xs text-slate-400">Track your consumption percentage against budget limit</p>
            </div>
            <span className="text-xs font-bold text-indigo-400">{budgetStatus.utilizationPercentage.toFixed(1)}%</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                budgetStatus.utilizationPercentage > 100
                  ? 'bg-rose-500'
                  : budgetStatus.utilizationPercentage >= 80
                  ? 'bg-amber-500'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-500'
              }`}
              style={{ width: `${Math.min(budgetStatus.utilizationPercentage, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Pie Chart: Category Breakdown */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-white">Expense by Category</h3>
              <p className="text-xs text-slate-400">Category distribution of expenses</p>
            </div>
            <PieIcon className="w-5 h-5 text-indigo-400" />
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => [`$${val.toFixed(2)}`, 'Amount']}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-slate-500 italic">No category expense data available for this month</p>
            )}
          </div>
        </div>

        {/* Line Chart: Spending Trend */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-white">6-Month Spending Trend</h3>
              <p className="text-xs text-slate-400">Monthly expense evolution over time</p>
            </div>
            <TrendingUp className="w-5 h-5 text-purple-400" />
          </div>

          <div className="h-64 w-full">
            {trends.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                  <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    formatter={(val) => [`$${val.toFixed(2)}`, 'Spent']}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  />
                  <Line type="monotone" dataKey="totalSpent" stroke="#818cf8" strokeWidth={3} dot={{ r: 4, fill: '#818cf8' }} activeDot={{ r: 7 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-slate-500 italic flex items-center justify-center h-full">No trend data available</p>
            )}
          </div>
        </div>

      </div>

      {/* Recent Transactions List */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-bold text-white">Recent Transactions</h3>
            <p className="text-xs text-slate-400">Latest recorded expenses</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] text-slate-400 uppercase bg-slate-900/50 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3 rounded-l-xl">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Payment Method</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right rounded-r-xl">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recentExpenses.length > 0 ? (
                recentExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3.5 font-semibold text-slate-200">{exp.title}</td>
                    <td className="px-4 py-3.5">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {exp.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-400">{exp.paymentMethod}</td>
                    <td className="px-4 py-3.5 text-slate-400">{exp.expenseDate}</td>
                    <td className="px-4 py-3.5 text-right font-bold text-slate-100">${exp.amount.toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-slate-500">
                    No transactions recorded yet. Click "Add New Expense" to start!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Record New Expense">
        <form onSubmit={handleAddExpenseSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Expense Title</label>
            <input
              type="text"
              value={newExpense.title}
              onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
              placeholder="e.g., Grocery Shopping"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Amount ($)</label>
              <input
                type="number"
                step="0.01"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                placeholder="49.99"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={newExpense.category}
                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {['Food', 'Transport', 'Shopping', 'Education', 'Bills', 'Healthcare', 'Entertainment', 'Rent', 'Travel', 'Other'].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Expense Date</label>
              <input
                type="date"
                value={newExpense.expenseDate}
                onChange={(e) => setNewExpense({ ...newExpense, expenseDate: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Payment Method</label>
              <select
                value={newExpense.paymentMethod}
                onChange={(e) => setNewExpense({ ...newExpense, paymentMethod: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {['UPI', 'Credit Card', 'Debit Card', 'Cash', 'Net Banking'].map(pm => (
                  <option key={pm} value={pm}>{pm}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description (Optional)</label>
            <textarea
              rows="2"
              value={newExpense.description}
              onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
              placeholder="Additional notes..."
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={modalLoading}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30"
            >
              {modalLoading ? 'Saving...' : 'Save Expense'}
            </button>
          </div>

        </form>
      </Modal>

    </div>
  );
};

export default Dashboard;
