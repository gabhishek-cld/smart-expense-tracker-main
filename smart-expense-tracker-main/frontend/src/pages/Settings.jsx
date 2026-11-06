import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, Sliders, DollarSign, Database } from 'lucide-react';

const Settings = () => {
  const { theme, toggleTheme } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      <div className="glass-card p-6 rounded-3xl border border-slate-800">
        <h1 className="text-2xl font-extrabold text-white">Application Settings</h1>
        <p className="text-xs text-slate-400 mt-1">Configure workspace theme preferences and interface options.</p>
      </div>

      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-6">
        
        {/* Theme Setting */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white">Interface Theme</h3>
            <p className="text-xs text-slate-400">Switch between dark mode and light mode aesthetics.</p>
          </div>
          <button
            onClick={toggleTheme}
            className="px-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs font-semibold text-slate-200 flex items-center gap-2 hover:bg-slate-800 transition-colors"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Dark Theme Enabled</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-400" />
                <span>Light Theme Enabled</span>
              </>
            )}
          </button>
        </div>

        {/* Currency Setting */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white">Currency Format</h3>
            <p className="text-xs text-slate-400">Default currency display symbol</p>
          </div>
          <select className="px-3.5 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-200 focus:outline-none">
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="INR">INR (₹)</option>
          </select>
        </div>

        {/* Backend Info */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Backend Connection</h3>
            <p className="text-xs text-slate-400">Spring Boot REST API endpoint</p>
          </div>
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono rounded-lg">
            http://localhost:8080/api
          </span>
        </div>

      </div>

    </div>
  );
};

export default Settings;
