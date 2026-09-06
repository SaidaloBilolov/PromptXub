'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/AdminSidebar';
import { AdminNavbar } from '@/components/AdminNavbar';
import { UserStats, UserSummary } from '@/types';
import { fetchUserStats, toggleUserStatus } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import {
  Users,
  Search,
  Loader2,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  UserX,
  Bookmark,
  Calendar,
  Filter,
  Frown,
} from 'lucide-react';

export default function UsersPage() {
  const router = useRouter();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<'ALL' | 'Google' | 'Apple' | 'Email'>('ALL');

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login');
      return;
    }

    async function loadData() {
      try {
        const data = await fetchUserStats();
        setUserStats(data);
      } catch (err) {
        console.error('Failed to load user stats', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  const handleToggleStatus = async (id: number) => {
    if (!userStats) return;
    try {
      await toggleUserStatus(id);
      setUserStats({
        ...userStats,
        usersList: userStats.usersList.map((u) =>
          u.id === id ? { ...u, enabled: !u.enabled } : u
        ),
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !userStats) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500 mb-2" />
      </div>
    );
  }

  const filteredUsers = userStats.usersList.filter((user) => {
    const matchesSearch =
      (user.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProvider =
      selectedProvider === 'ALL' || user.provider.toLowerCase() === selectedProvider.toLowerCase();
    return matchesSearch && matchesProvider;
  });

  const totalUsersCount = userStats.totalUsers || 0;
  const googlePercentage = totalUsersCount > 0 ? Math.round((userStats.googleUsersCount / totalUsersCount) * 100) : 0;
  const applePercentage = totalUsersCount > 0 ? Math.round((userStats.appleUsersCount / totalUsersCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#0F172A] flex text-slate-100">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminNavbar
          title="User Accounts & Growth Analytics"
          subtitle="Real registered users from PostgreSQL database"
        />

        <main className="p-8 space-y-8 flex-1 overflow-y-auto">
          
          {/* Top 4 Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Total Registered Users */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Registered</span>
                <div className="p-2 rounded-xl bg-purple-950/60 text-purple-400 border border-purple-800/40">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-white mb-2">{totalUsersCount.toLocaleString()}</div>
              <div className="text-xs text-purple-400 font-semibold">Active PostgreSQL user accounts</div>
            </div>

            {/* Google OAuth Count */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Google OAuth</span>
                <div className="p-2 rounded-xl bg-cyan-950/60 text-cyan-400 border border-cyan-800/40">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-white mb-2">{userStats.googleUsersCount.toLocaleString()}</div>
              <div className="text-xs text-cyan-400 font-semibold">
                {googlePercentage}% of total accounts
              </div>
            </div>

            {/* Apple Sign-In Count */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Apple ID</span>
                <div className="p-2 rounded-xl bg-slate-800 text-slate-200 border border-slate-700">
                  <UserCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-white mb-2">{userStats.appleUsersCount.toLocaleString()}</div>
              <div className="text-xs text-slate-400 font-semibold">
                {applePercentage}% iOS / macOS accounts
              </div>
            </div>

            {/* Email Magic Link Count */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Links</span>
                <div className="p-2 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                  <UserCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-white mb-2">{userStats.emailUsersCount.toLocaleString()}</div>
              <div className="text-xs text-emerald-400 font-semibold">+{userStats.newUsersToday} new signups today</div>
            </div>
          </div>

          {/* Users Table Section */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search user name or email..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
                  {(['ALL', 'Google', 'Apple', 'Email'] as const).map((prov) => (
                    <button
                      key={prov}
                      onClick={() => setSelectedProvider(prov)}
                      className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                        selectedProvider === prov
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {prov}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Users Table or Empty State */}
            {filteredUsers.length === 0 ? (
              <div className="py-16 text-center space-y-3 max-w-sm mx-auto">
                <div className="inline-flex p-4 rounded-full bg-slate-950 border border-slate-800 text-slate-400">
                  <UserX className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-base font-bold text-slate-200">No registered users found yet</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {searchQuery || selectedProvider !== 'ALL'
                    ? 'No user accounts match your search filters.'
                    : 'Users who sign up via Google OAuth, Apple Sign-In, or Email Magic Link will appear here automatically.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase">
                      <th className="pb-3 pl-2">User Profile</th>
                      <th className="pb-3 px-3">Email Address</th>
                      <th className="pb-3 px-3">Auth Provider</th>
                      <th className="pb-3 px-3">Joined Date</th>
                      <th className="pb-3 px-3 text-right">Saved Prompts</th>
                      <th className="pb-3 px-3 text-center">Account Status</th>
                      <th className="pb-3 pr-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-3.5 pl-2 flex items-center gap-3">
                          <img
                            src={
                              user.avatarUrl ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                user.name
                              )}&background=6366f1&color=fff`
                            }
                            alt=""
                            className="w-9 h-9 rounded-full object-cover border border-slate-700 shrink-0 bg-slate-950"
                          />
                          <span className="font-semibold text-slate-100">{user.name}</span>
                        </td>
                        <td className="py-3.5 px-3 text-slate-300 font-mono">{user.email}</td>
                        <td className="py-3.5 px-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              user.provider.toLowerCase() === 'google'
                                ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800'
                                : user.provider.toLowerCase() === 'apple'
                                ? 'bg-slate-800 text-slate-200 border border-slate-700'
                                : 'bg-purple-950/80 text-purple-300 border border-purple-800'
                            }`}
                          >
                            {user.provider}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-500" />
                            <span>{new Date(user.joinedDate).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-right font-bold text-purple-400">
                          <div className="flex items-center justify-end gap-1">
                            <Bookmark className="w-3.5 h-3.5 text-purple-400" />
                            <span>{user.savedPromptsCount || 0}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          {user.enabled ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                              <ShieldCheck className="w-3 h-3" /> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-950/80 text-rose-400 border border-rose-800">
                              <ShieldAlert className="w-3 h-3" /> Blocked
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 pr-2 text-right">
                          <button
                            onClick={() => handleToggleStatus(user.id)}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold border transition active:scale-95 cursor-pointer ${
                              user.enabled
                                ? 'bg-rose-950/60 hover:bg-rose-900 text-rose-300 border-rose-800/60'
                                : 'bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border-emerald-800/60'
                            }`}
                          >
                            {user.enabled ? 'Block User' : 'Unblock User'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}
