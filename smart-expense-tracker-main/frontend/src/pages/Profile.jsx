import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Calendar, ShieldCheck, Award } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      <div className="glass-card p-6 rounded-3xl border border-slate-800">
        <h1 className="text-2xl font-extrabold text-white">User Profile</h1>
        <p className="text-xs text-slate-400 mt-1">Manage your account details and credentials.</p>
      </div>

      <div className="glass-card p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-center gap-6">
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-black text-white text-3xl shadow-xl shadow-indigo-600/30">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>

        <div className="space-y-2 text-center md:text-left flex-1">
          <h2 className="text-xl font-extrabold text-white">{user?.name}</h2>
          <p className="text-xs text-slate-400 flex items-center justify-center md:justify-start gap-2">
            <Mail className="w-4 h-4 text-indigo-400" />
            <span>{user?.email}</span>
          </p>
          <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              JWT Authenticated User
            </span>
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" />
              Isolated Financial Workspace
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Profile;
