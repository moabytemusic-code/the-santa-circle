"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Shield,
  Crown,
  Users,
  Gift,
  DollarSign,
  Sparkles,
  Search,
  CheckCircle,
  XCircle,
  Trash2,
  Edit3,
  RefreshCw,
  ArrowLeft,
  AlertTriangle,
  Loader2,
  Calendar,
  Mail,
  ChevronRight,
  Check,
  X,
  ExternalLink,
} from "lucide-react";

interface OverviewStats {
  totalUsers: number;
  totalCircles: number;
  totalExchanges: number;
  totalPaidPasses: number;
  totalRevenue: number;
}

interface CircleItem {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  creator: { id: string; name: string; email: string };
  membersCount: number;
  members: { id: string; name: string; email: string }[];
  exchangeId?: string;
  exchangeYear: number;
  exchangeStatus: string;
  budgetLimit?: number;
  isPremium: boolean;
  participantsCount: number;
  drawnAssignmentsCount: number;
}

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  createdAt: string;
  membershipsCount: number;
  createdGroupsCount: number;
  participationsCount: number;
  wishListsCount: number;
  circles: { id: string; name: string; role: string }[];
}

export default function SuperAdminPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "circles" | "users">("overview");
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Stats & Data
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [recentCircles, setRecentCircles] = useState<any[]>([]);
  const [circles, setCircles] = useState<CircleItem[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);

  // Search filters
  const [circleSearch, setCircleSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");

  // Modals & Action States
  const [editingCircle, setEditingCircle] = useState<CircleItem | null>(null);
  const [editCircleName, setEditCircleName] = useState("");
  const [deletingCircle, setDeletingCircle] = useState<CircleItem | null>(null);

  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [editUserName, setEditUserName] = useState("");
  const [editUserEmail, setEditUserEmail] = useState("");
  const [deletingUser, setDeletingUser] = useState<UserItem | null>(null);

  const [actionLoading, setActionLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadAllData = async () => {
    setRefreshing(true);
    try {
      const [overviewRes, circlesRes, usersRes] = await Promise.all([
        fetch("/api/super-admin/overview"),
        fetch("/api/super-admin/circles"),
        fetch("/api/super-admin/users"),
      ]);

      if (overviewRes.status === 403 || circlesRes.status === 403 || usersRes.status === 403) {
        setUnauthorized(true);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      if (overviewRes.ok) {
        const data = await overviewRes.json();
        setStats(data.stats);
        setRecentUsers(data.recentUsers || []);
        setRecentCircles(data.recentCircles || []);
      }

      if (circlesRes.ok) {
        const data = await circlesRes.json();
        setCircles(data.circles || []);
      }

      if (usersRes.ok) {
        const data = await usersRes.json();
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to load super admin data.", "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Filtered Circles
  const filteredCircles = useMemo(() => {
    if (!circleSearch.trim()) return circles;
    const q = circleSearch.toLowerCase();
    return circles.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.creator?.name?.toLowerCase().includes(q) ||
        c.creator?.email?.toLowerCase().includes(q)
    );
  }, [circles, circleSearch]);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    if (!userSearch.trim()) return users;
    const q = userSearch.toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
    );
  }, [users, userSearch]);

  // Circle Actions
  const handleTogglePremium = async (circle: CircleItem) => {
    const newStatus = !circle.isPremium;
    try {
      const res = await fetch(`/api/super-admin/circles/${circle.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPremium: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      
      setCircles((prev) =>
        prev.map((c) => (c.id === circle.id ? { ...c, isPremium: newStatus } : c))
      );
      showToast(
        newStatus
          ? `Host Pass granted to "${circle.name}"! ✨`
          : `Host Pass revoked for "${circle.name}".`
      );
    } catch {
      showToast("Error updating Host Pass status.", "error");
    }
  };

  const handleSaveCircleEdit = async () => {
    if (!editingCircle || !editCircleName.trim()) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/super-admin/circles/${editingCircle.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editCircleName.trim() }),
      });
      if (!res.ok) throw new Error("Failed to update name");

      setCircles((prev) =>
        prev.map((c) => (c.id === editingCircle.id ? { ...c, name: editCircleName.trim() } : c))
      );
      showToast(`Circle renamed to "${editCircleName.trim()}".`);
      setEditingCircle(null);
    } catch {
      showToast("Error renaming circle.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCircle = async () => {
    if (!deletingCircle) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/super-admin/circles/${deletingCircle.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete circle");

      setCircles((prev) => prev.filter((c) => c.id !== deletingCircle.id));
      showToast(`Circle "${deletingCircle.name}" deleted.`);
      setDeletingCircle(null);
      // update stats count
      setStats((prev) => prev ? { ...prev, totalCircles: Math.max(0, prev.totalCircles - 1) } : null);
    } catch {
      showToast("Error deleting circle.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // User Actions
  const handleToggleUserRole = async (user: UserItem) => {
    const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";
    try {
      const res = await fetch(`/api/super-admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error("Failed to update role");

      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
      );
      showToast(`User role changed to ${newRole}.`);
    } catch {
      showToast("Error changing user role.", "error");
    }
  };

  const handleSaveUserEdit = async () => {
    if (!editingUser || !editUserName.trim() || !editUserEmail.trim()) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/super-admin/users/${editingUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editUserName.trim(), email: editUserEmail.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update user");

      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? { ...u, name: editUserName.trim(), email: editUserEmail.trim() }
            : u
        )
      );
      showToast("User details saved.");
      setEditingUser(null);
    } catch (err: any) {
      showToast(err.message || "Error updating user.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/super-admin/users/${deletingUser.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete user");

      setUsers((prev) => prev.filter((u) => u.id !== deletingUser.id));
      showToast(`User "${deletingUser.name}" deleted.`);
      setDeletingUser(null);
      setStats((prev) => prev ? { ...prev, totalUsers: Math.max(0, prev.totalUsers - 1) } : null);
    } catch (err: any) {
      showToast(err.message || "Error deleting user.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[65vh] text-[#fef9ee]">
        <Loader2 className="w-10 h-10 animate-spin text-[#d4af37] mb-4" />
        <p className="font-festive text-xl text-slate-300">Loading Master Control...</p>
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="flex-1 max-w-xl mx-auto px-4 py-20 text-center">
        <div className="bg-[#144534]/90 border border-red-500/40 rounded-2xl p-8 shadow-2xl backdrop-blur-md">
          <div className="w-16 h-16 bg-red-950/50 border border-red-500/40 rounded-full flex items-center justify-center mx-auto mb-4 text-red-400">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold font-festive text-[#fef9ee] mb-2">Access Denied</h1>
          <p className="text-slate-300 text-sm mb-6">
            This area requires Super Admin credentials. Only authorized platform administrators have access to Master Control.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-xl bg-[#1d5943] hover:bg-[#256f54] text-[#fef9ee] font-medium transition text-sm flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#b89528] text-[#0b2b20] font-bold transition text-sm"
            >
              Log in with Admin Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl backdrop-blur-md border text-sm font-medium flex items-center space-x-2 transition animate-bounce ${
            toastMessage.type === "success"
              ? "bg-[#144534] border-[#d4af37] text-[#fef9ee]"
              : "bg-red-950 border-red-500 text-red-200"
          }`}
        >
          {toastMessage.type === "success" ? (
            <CheckCircle className="w-5 h-5 text-[#d4af37]" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-400" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#f3c053] text-xs font-bold uppercase tracking-wider mb-2">
            <Crown className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Platform Master Control</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-festive text-[#fef9ee] tracking-wide">
            Super Admin Dashboard
          </h1>
          <p className="text-slate-300 text-sm mt-1">
            Real-time platform metrics, Circle management, and user control.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={loadAllData}
            disabled={refreshing}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#144534] border border-[#1d5943] text-slate-200 hover:text-[#d4af37] text-xs font-medium transition"
            title="Refresh metrics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-[#d4af37]" : ""}`} />
            <span>Refresh</span>
          </button>
          <Link
            href="/dashboard"
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#1d5943] hover:bg-[#256f54] text-[#fef9ee] text-xs font-semibold transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Circle App</span>
          </Link>
        </div>
      </div>

      {/* KPI Top Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Revenue */}
        <div className="bg-[#144534]/80 border border-[#d4af37]/30 rounded-2xl p-5 shadow-xl backdrop-blur-md relative overflow-hidden group hover:border-[#d4af37]/60 transition">
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-[#d4af37]/10 rounded-full blur-xl group-hover:scale-150 transition" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-300">Total Revenue</span>
            <div className="p-2 rounded-xl bg-[#d4af37]/20 text-[#d4af37]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#fef9ee]">
            ${stats?.totalRevenue.toFixed(2) || "0.00"}
          </div>
          <span className="text-[11px] text-[#f3c053] mt-1 block">
            {stats?.totalPaidPasses || 0} Host Passes sold ($7.99)
          </span>
        </div>

        {/* Paid Circles */}
        <div className="bg-[#144534]/80 border border-[#1d5943] rounded-2xl p-5 shadow-xl backdrop-blur-md relative overflow-hidden group hover:border-[#d4af37]/40 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-300">Paid Host Passes</span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Crown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#fef9ee]">
            {stats?.totalPaidPasses || 0}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Active premium circles</span>
        </div>

        {/* Total Circles */}
        <div className="bg-[#144534]/80 border border-[#1d5943] rounded-2xl p-5 shadow-xl backdrop-blur-md relative overflow-hidden group hover:border-[#d4af37]/40 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-300">Total Circles</span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Gift className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#fef9ee]">
            {stats?.totalCircles || 0}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Created gift exchanges</span>
        </div>

        {/* Total Users */}
        <div className="bg-[#144534]/80 border border-[#1d5943] rounded-2xl p-5 shadow-xl backdrop-blur-md relative overflow-hidden group hover:border-[#d4af37]/40 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-300">Registered Users</span>
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#fef9ee]">
            {stats?.totalUsers || 0}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Participants & organizers</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-[#1d5943] mb-6 pb-2">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
            activeTab === "overview"
              ? "bg-[#1d5943] text-[#d4af37] border border-[#d4af37]/40 shadow-sm"
              : "text-slate-300 hover:text-[#fef9ee] hover:bg-[#144534]"
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#d4af37]" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveTab("circles")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
            activeTab === "circles"
              ? "bg-[#1d5943] text-[#d4af37] border border-[#d4af37]/40 shadow-sm"
              : "text-slate-300 hover:text-[#fef9ee] hover:bg-[#144534]"
          }`}
        >
          <Gift className="w-4 h-4 text-[#d4af37]" />
          <span>Circles ({circles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
            activeTab === "users"
              ? "bg-[#1d5943] text-[#d4af37] border border-[#d4af37]/40 shadow-sm"
              : "text-slate-300 hover:text-[#fef9ee] hover:bg-[#144534]"
          }`}
        >
          <Users className="w-4 h-4 text-[#d4af37]" />
          <span>Users ({users.length})</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Circles Card */}
          <div className="bg-[#144534]/70 border border-[#1d5943] rounded-2xl p-6 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold font-festive text-[#fef9ee] flex items-center space-x-2">
                <span>🎄</span>
                <span>Recent Circles</span>
              </h2>
              <button
                onClick={() => setActiveTab("circles")}
                className="text-xs text-[#f3c053] hover:underline flex items-center space-x-1"
              >
                <span>View all</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-[#1d5943]/60">
              {recentCircles.length === 0 ? (
                <p className="text-slate-400 text-sm py-4">No circles created yet.</p>
              ) : (
                recentCircles.map((c) => (
                  <div key={c.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-sm text-[#fef9ee]">{c.name}</span>
                        {c.isPremium && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40">
                            HOST PASS
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Host: {c.creator?.name || "Unknown"} ({c.creator?.email}) &bull; {c.memberCount} members
                      </p>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Signups Card */}
          <div className="bg-[#144534]/70 border border-[#1d5943] rounded-2xl p-6 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold font-festive text-[#fef9ee] flex items-center space-x-2">
                <span>🎅</span>
                <span>Recent User Signups</span>
              </h2>
              <button
                onClick={() => setActiveTab("users")}
                className="text-xs text-[#f3c053] hover:underline flex items-center space-x-1"
              >
                <span>View all</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-[#1d5943]/60">
              {recentUsers.length === 0 ? (
                <p className="text-slate-400 text-sm py-4">No users registered yet.</p>
              ) : (
                recentUsers.map((u) => (
                  <div key={u.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-sm text-[#fef9ee]">{u.name}</span>
                        {u.role === "ADMIN" && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            ADMIN
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{u.email}</p>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CIRCLES DIRECTORY */}
      {activeTab === "circles" && (
        <div className="bg-[#144534]/70 border border-[#1d5943] rounded-2xl p-6 shadow-xl backdrop-blur-md">
          {/* Search bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search circles by name or host email..."
                value={circleSearch}
                onChange={(e) => setCircleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#0b2b20] border border-[#1d5943] rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#d4af37]"
              />
            </div>
            <div className="text-xs text-slate-300">
              Showing {filteredCircles.length} of {circles.length} Circles
            </div>
          </div>

          {/* Circles Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-200">
              <thead className="bg-[#0b2b20]/60 text-xs uppercase tracking-wider text-slate-400 border-b border-[#1d5943]">
                <tr>
                  <th className="py-3 px-4">Circle Name</th>
                  <th className="py-3 px-4">Host</th>
                  <th className="py-3 px-4 text-center">Members</th>
                  <th className="py-3 px-4 text-center">Exchange Status</th>
                  <th className="py-3 px-4 text-center">Host Pass</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1d5943]/60">
                {filteredCircles.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No matching circles found.
                    </td>
                  </tr>
                ) : (
                  filteredCircles.map((circle) => (
                    <tr key={circle.id} className="hover:bg-[#144534]/40 transition">
                      <td className="py-3.5 px-4 font-semibold text-[#fef9ee]">
                        {circle.name}
                        <div className="text-[11px] text-slate-400 font-normal">
                          Created {new Date(circle.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-200">{circle.creator?.name || "Unknown"}</div>
                        <div className="text-xs text-slate-400">{circle.creator?.email}</div>
                      </td>
                      <td className="py-3.5 px-4 text-center font-medium">
                        {circle.membersCount}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            circle.exchangeStatus === "DRAWN"
                              ? "bg-purple-900/40 text-purple-300 border border-purple-500/30"
                              : circle.exchangeStatus === "READY_TO_DRAW"
                              ? "bg-blue-900/40 text-blue-300 border border-blue-500/30"
                              : "bg-slate-800 text-slate-300 border border-slate-700"
                          }`}
                        >
                          {circle.exchangeStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleTogglePremium(circle)}
                          className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition border ${
                            circle.isPremium
                              ? "bg-[#d4af37]/20 border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37]/30"
                              : "bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-500"
                          }`}
                          title="Click to toggle Host Pass premium"
                        >
                          <Crown className="w-3.5 h-3.5" />
                          <span>{circle.isPremium ? "PREMIUM ($7.99)" : "COMP PASS"}</span>
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => {
                              setEditingCircle(circle);
                              setEditCircleName(circle.name);
                            }}
                            className="p-1.5 text-slate-400 hover:text-[#d4af37] hover:bg-[#0b2b20] rounded-lg transition"
                            title="Edit circle name"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingCircle(circle)}
                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition"
                            title="Delete circle"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: USERS DIRECTORY */}
      {activeTab === "users" && (
        <div className="bg-[#144534]/70 border border-[#1d5943] rounded-2xl p-6 shadow-xl backdrop-blur-md">
          {/* Search bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#0b2b20] border border-[#1d5943] rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#d4af37]"
              />
            </div>
            <div className="text-xs text-slate-300">
              Showing {filteredUsers.length} of {users.length} Users
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-200">
              <thead className="bg-[#0b2b20]/60 text-xs uppercase tracking-wider text-slate-400 border-b border-[#1d5943]">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4 text-center">Circles</th>
                  <th className="py-3 px-4">Joined Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1d5943]/60">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No matching users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-[#144534]/40 transition">
                      <td className="py-3.5 px-4 font-semibold text-[#fef9ee]">
                        <div>{user.name}</div>
                        <div className="text-xs text-slate-400 font-normal">{user.email}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleUserRole(user)}
                          className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border transition ${
                            user.role === "ADMIN"
                              ? "bg-amber-500/20 border-amber-400/50 text-amber-300 hover:bg-amber-500/30"
                              : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500"
                          }`}
                          title="Click to toggle user role"
                        >
                          <Shield className="w-3 h-3" />
                          <span>{user.role}</span>
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-semibold">{user.membershipsCount}</span>
                        {user.createdGroupsCount > 0 && (
                          <span className="text-[11px] text-[#f3c053] block">
                            ({user.createdGroupsCount} hosted)
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => {
                              setEditingUser(user);
                              setEditUserName(user.name);
                              setEditUserEmail(user.email);
                            }}
                            className="p-1.5 text-slate-400 hover:text-[#d4af37] hover:bg-[#0b2b20] rounded-lg transition"
                            title="Edit user details"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingUser(user)}
                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition"
                            title="Delete user"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* EDIT CIRCLE MODAL */}
      {editingCircle && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#144534] border border-[#d4af37]/40 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold font-festive text-[#fef9ee] mb-3">Edit Circle</h3>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Circle Name
              </label>
              <input
                type="text"
                value={editCircleName}
                onChange={(e) => setEditCircleName(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#0b2b20] border border-[#1d5943] rounded-xl text-slate-100 text-sm focus:outline-none focus:border-[#d4af37]"
              />
            </div>
            <div className="flex items-center justify-end space-x-2">
              <button
                onClick={() => setEditingCircle(null)}
                className="px-4 py-2 rounded-xl text-slate-300 hover:bg-[#1d5943] text-sm transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCircleEdit}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl bg-[#d4af37] hover:bg-[#b89528] text-[#0b2b20] font-bold text-sm transition flex items-center space-x-1.5"
              >
                {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CIRCLE CONFIRMATION MODAL */}
      {deletingCircle && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#144534] border border-red-500/40 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="w-12 h-12 bg-red-950/60 border border-red-500/40 rounded-full flex items-center justify-center mb-3 text-red-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#fef9ee] mb-1">Delete Circle?</h3>
            <p className="text-slate-300 text-sm mb-5">
              Are you sure you want to delete <span className="font-semibold text-white">"{deletingCircle.name}"</span>?
              This will permanently remove all associated gift exchanges, participants, and wishlist links.
            </p>
            <div className="flex items-center justify-end space-x-2">
              <button
                onClick={() => setDeletingCircle(null)}
                className="px-4 py-2 rounded-xl text-slate-300 hover:bg-[#1d5943] text-sm transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCircle}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition flex items-center space-x-1.5"
              >
                {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Delete Permanently</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#144534] border border-[#d4af37]/40 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold font-festive text-[#fef9ee] mb-3">Edit User</h3>
            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={editUserName}
                  onChange={(e) => setEditUserName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#0b2b20] border border-[#1d5943] rounded-xl text-slate-100 text-sm focus:outline-none focus:border-[#d4af37]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={editUserEmail}
                  onChange={(e) => setEditUserEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#0b2b20] border border-[#1d5943] rounded-xl text-slate-100 text-sm focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-2">
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 rounded-xl text-slate-300 hover:bg-[#1d5943] text-sm transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveUserEdit}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl bg-[#d4af37] hover:bg-[#b89528] text-[#0b2b20] font-bold text-sm transition flex items-center space-x-1.5"
              >
                {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE USER CONFIRMATION MODAL */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#144534] border border-red-500/40 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="w-12 h-12 bg-red-950/60 border border-red-500/40 rounded-full flex items-center justify-center mb-3 text-red-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#fef9ee] mb-1">Delete User Account?</h3>
            <p className="text-slate-300 text-sm mb-5">
              Are you sure you want to delete <span className="font-semibold text-white">{deletingUser.name}</span> ({deletingUser.email})?
              Their memberships and wishlist items will be permanently removed.
            </p>
            <div className="flex items-center justify-end space-x-2">
              <button
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2 rounded-xl text-slate-300 hover:bg-[#1d5943] text-sm transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition flex items-center space-x-1.5"
              >
                {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Delete Permanently</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
