import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import Modal from '../components/Modal';
import { 
  Search, Filter, Plus, Edit2, Trash2, Calendar, ChevronLeft, ChevronRight, 
  ArrowUpDown, XCircle, RefreshCw, FileText
} from 'lucide-react';

const CATEGORIES = ['ALL', 'Food', 'Transport', 'Shopping', 'Education', 'Bills', 'Healthcare', 'Entertainment', 'Rent', 'Travel', 'Other'];
const PAYMENT_METHODS = ['ALL', 'UPI', 'Credit Card', 'Debit Card', 'Cash', 'Net Banking'];

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [pageInfo, setPageInfo] = useState({ pageNo: 0, pageSize: 10, totalPages: 1, totalElements: 0, last: true });
  
  // Filters & Search
  const [searchTitle, setSearchTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('expenseDate');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(0);

  const [loading, setLoading] = useState(false);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food',
    expenseDate: new Date().toISOString().split('T')[0],
    description: '',
    paymentMethod: 'UPI'
  });
  const [modalLoading, setModalLoading] = useState(false);

  // Delete Confirm Modal State
  const [deletingId, setDeletingId] = useState(null);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      let queryParams = `page=${page}&size=10&sortBy=${sortBy}&sortDir=${sortDir}`;
      if (searchTitle.trim()) queryParams += `&title=${encodeURIComponent(searchTitle.trim())}`;
      if (selectedCategory !== 'ALL') queryParams += `&category=${encodeURIComponent(selectedCategory)}`;
      if (selectedPaymentMethod !== 'ALL') queryParams += `&paymentMethod=${encodeURIComponent(selectedPaymentMethod)}`;
      if (startDate) queryParams += `&startDate=${startDate}`;
      if (endDate) queryParams += `&endDate=${endDate}`;

      const res = await API.get(`/expenses?${queryParams}`);
      const data = res.data.data;
      setExpenses(data.content || []);
      setPageInfo({
        pageNo: data.pageNo,
        pageSize: data.pageSize,
        totalPages: data.totalPages,
        totalElements: data.totalElements,
        last: data.last
      });
    } catch (err) {
      console.error('Failed to fetch expenses', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [page, sortBy, sortDir, selectedCategory, selectedPaymentMethod, startDate, endDate]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchExpenses();
  };

  const handleClearFilters = () => {
    setSearchTitle('');
    setSelectedCategory('ALL');
    setSelectedPaymentMethod('ALL');
    setStartDate('');
    setEndDate('');
    setSortBy('expenseDate');
    setSortDir('desc');
    setPage(0);
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      amount: '',
      category: 'Food',
      expenseDate: new Date().toISOString().split('T')[0],
      description: '',
      paymentMethod: 'UPI'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (exp) => {
    setEditingId(exp.id);
    setFormData({
      title: exp.title,
      amount: exp.amount,
      category: exp.category,
      expenseDate: exp.expenseDate,
      description: exp.description || '',
      paymentMethod: exp.paymentMethod
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount)
      };

      if (editingId) {
        await API.put(`/expenses/${editingId}`, payload);
      } else {
        await API.post('/expenses', payload);
      }

      setIsModalOpen(false);
      fetchExpenses();
    } catch (err) {
      alert(err.response?.data?.message || 'Operation failed');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteExpense = async () => {
    if (!deletingId) return;
    try {
      await API.delete(`/expenses/${deletingId}`);
      setDeletingId(null);
      fetchExpenses();
    } catch (err) {
      alert('Failed to delete expense record');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 glass-card p-6 rounded-3xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Expense Records</h1>
          <p className="text-xs text-slate-400 mt-1">Manage, filter, search, and track all your logged transactions.</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-5 py-3 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Expense</span>
        </button>
      </div>

      {/* Search & Filtering Bar */}
      <div className="glass-card p-5 rounded-3xl border border-slate-800 space-y-4">
        
        <form onSubmit={handleSearchSubmit} className="flex flex-col lg:flex-row items-center gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              placeholder="Search expenses by title..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700/60 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setPage(0); }}
            className="w-full lg:w-44 px-3.5 py-2.5 bg-slate-900/80 border border-slate-700/60 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            {CATEGORIES.map(c => <option key={c} value={c}>Cat: {c}</option>)}
          </select>

          {/* Payment Method Filter */}
          <select
            value={selectedPaymentMethod}
            onChange={(e) => { setSelectedPaymentMethod(e.target.value); setPage(0); }}
            className="w-full lg:w-44 px-3.5 py-2.5 bg-slate-900/80 border border-slate-700/60 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            {PAYMENT_METHODS.map(p => <option key={p} value={p}>Method: {p}</option>)}
          </select>

          <button
            type="submit"
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all w-full lg:w-auto"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
          </button>

        </form>

        {/* Extended Filter Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span>Date:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => { setStartDate(e.target.value); setPage(0); }}
                className="px-2.5 py-1.5 bg-slate-900 border border-slate-700/60 rounded-lg text-xs text-slate-200 focus:outline-none"
              />
              <span>to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => { setEndDate(e.target.value); setPage(0); }}
                className="px-2.5 py-1.5 bg-slate-900 border border-slate-700/60 rounded-lg text-xs text-slate-200 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort:</span>
              <select
                value={`${sortBy}-${sortDir}`}
                onChange={(e) => {
                  const [b, d] = e.target.value.split('-');
                  setSortBy(b);
                  setSortDir(d);
                }}
                className="px-2.5 py-1.5 bg-slate-900 border border-slate-700/60 rounded-lg text-xs text-slate-200 focus:outline-none"
              >
                <option value="expenseDate-desc">Date (Latest)</option>
                <option value="expenseDate-asc">Date (Oldest)</option>
                <option value="amount-desc">Amount (Highest)</option>
                <option value="amount-asc">Amount (Lowest)</option>
              </select>
            </div>

            <button
              onClick={handleClearFilters}
              className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white flex items-center gap-1 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

        </div>

      </div>

      {/* Expenses Table Card */}
      <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] text-slate-400 uppercase bg-slate-900/60 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Payment Method</th>
                <th className="px-6 py-4">Expense Date</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                    Loading expenses...
                  </td>
                </tr>
              ) : expenses.length > 0 ? (
                expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-100">{exp.title}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        {exp.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{exp.paymentMethod}</td>
                    <td className="px-6 py-4 text-slate-400">{exp.expenseDate}</td>
                    <td className="px-6 py-4 text-slate-400 truncate max-w-xs">{exp.description || '-'}</td>
                    <td className="px-6 py-4 text-right font-bold text-slate-100">${exp.amount.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(exp)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                          title="Edit expense"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingId(exp.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete expense"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                    No expense records found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {pageInfo.totalPages > 1 && (
          <div className="px-6 py-4 bg-slate-900/40 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>
              Showing Page {pageInfo.pageNo + 1} of {pageInfo.totalPages} ({pageInfo.totalElements} Total)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 0}
                onClick={() => setPage(p => Math.max(p - 1, 0))}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={pageInfo.last}
                onClick={() => setPage(p => p + 1)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Expense Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingId ? "Edit Expense Record" : "Add New Expense"}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Expense Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Electricity Bill"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Amount ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="120.50"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {CATEGORIES.filter(c => c !== 'ALL').map(cat => (
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
                value={formData.expenseDate}
                onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Payment Method</label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {PAYMENT_METHODS.filter(p => p !== 'ALL').map(pm => (
                  <option key={pm} value={pm}>{pm}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description (Optional)</label>
            <textarea
              rows="2"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Notes..."
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
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
              {modalLoading ? 'Saving...' : editingId ? 'Update Expense' : 'Create Expense'}
            </button>
          </div>

        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deletingId} onClose={() => setDeletingId(null)} title="Confirm Deletion">
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            Are you sure you want to delete this expense record? This operation cannot be undone.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setDeletingId(null)}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteExpense}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-600/30"
            >
              Delete Permanently
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default Expenses;
