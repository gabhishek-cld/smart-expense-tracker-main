import React from 'react';
import { Link } from 'react-router-dom';
import { Wallet, ShieldCheck, BarChart3, PieChart, FileText, ArrowRight, CheckCircle2, Zap } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between overflow-hidden bg-slate-950 text-slate-100">
      
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Navigation Header */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-6 w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Smart<span className="text-indigo-400">Expense</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="px-5 py-2.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link
            to="/register"
            className="px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl shadow-lg shadow-indigo-500/25 transition-all"
          >
            Create Account
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-16 lg:py-24 text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-indigo-500/30 text-indigo-300 text-xs font-medium mb-8 animate-bounce">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          Full-Stack Spring Boot & React Application
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
          Master Your Financial Life with <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Smart Intelligence</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Record daily expenses, set real-time monthly budget alerts, visualize spending patterns through interactive charts, and export presentation-ready PDF reports.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-4 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-2xl shadow-xl shadow-indigo-600/35 flex items-center justify-center gap-2 group transition-all duration-300"
          >
            Launch Expense Tracker
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-4 text-sm font-bold text-slate-300 glass-card hover:bg-slate-800/80 rounded-2xl border border-slate-700/60 transition-all"
          >
            Explore Demo Login
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          
          <div className="glass-card p-6 rounded-2xl hover:border-indigo-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/20 flex items-center justify-center text-indigo-400 mb-4">
              <PieChart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Category Analytics</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automatic category breakdown across Food, Transport, Rent, Bills, Shopping, and custom user categories.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl hover:border-purple-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-purple-600/20 flex items-center justify-center text-purple-400 mb-4">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Smart Budget Alerts</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Set monthly budget limits with automatic progress tracking and color-coded warning thresholds at 80% and 100%.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl hover:border-emerald-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/20 flex items-center justify-center text-emerald-400 mb-4">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">CSV & PDF Exports</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generate formatted PDF monthly financial statements and CSV datasets with one click.
            </p>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Smart Expense Tracker. Java Spring Boot + React Full-Stack Application.</p>
          <div className="flex items-center gap-2 text-indigo-400">
            <ShieldCheck className="w-4 h-4" />
            <span>JWT Security & User Data Isolation</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Landing;
