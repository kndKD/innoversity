"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  ShieldAlert,
  Users,
  Lightbulb,
  FileCheck2,
  Terminal,
  LogOut,
  RefreshCw,
  Search,
  CheckCircle,
  XCircle,
  ExternalLink,
  Building,
  MapPin,
  Calendar,
  AlertTriangle,
  History,
  UserPlus,
  UserX,
  BadgeAlert,
  Eye,
  Filter,
} from "lucide-react";

interface AdminProfile {
  id: string;
  email: string;
  fullName?: string;
  role: string;
}

interface SellerKycItem {
  id: string;
  userId: string;
  applicantName?: string;
  shopName?: string;
  shopCategory?: string;
  shopBio?: string;
  institutionOrBusiness: string;
  district: string;
  verificationStatus: string;
  nicNumber: string;
  documentUrl: string;
  documentType?: string;
  submittedAt: string;
  verifierEmail?: string;
  notes?: string;
}

interface InnovationItem {
  id: string;
  title: string;
  description?: string;
  price: number;
  status: string; // active | pending | rejected
  createdAt: string;
  sellerName: string;
  sellerEmail: string;
  institution: string;
  hasCertificate: boolean;
  supervisorEndorsement: string;
}

interface AuditLogItem {
  id: string;
  adminEmail: string;
  action: string;
  targetType: string;
  targetId?: string;
  details?: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();

  // Active Tab: 'KYC' | 'INNOVATIONS' | 'TEAM' | 'AUDIT'
  const [activeTab, setActiveTab] = useState<"KYC" | "INNOVATIONS" | "TEAM" | "AUDIT">("KYC");

  // Admin Profile & Stats
  const [currentAdmin, setCurrentAdmin] = useState<AdminProfile | null>(null);
  const [stats, setStats] = useState<any>({
    pendingKycCount: 0,
    approvedKycCount: 0,
    pendingInnovationsCount: 0,
    totalActiveProducts: 0,
    adminTeamCount: 0,
    totalUsers: 0,
  });

  // Data lists
  const [kycQueue, setKycQueue] = useState<SellerKycItem[]>([]);
  const [innovations, setInnovations] = useState<InnovationItem[]>([]);
  const [adminTeam, setAdminTeam] = useState<AdminProfile[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);

  // Filtering & search
  const [kycFilter, setKycFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [innovationFilter, setInnovationFilter] = useState<"all" | "pending" | "active" | "rejected">("pending");
  const [searchQuery, setSearchQuery] = useState("");

  // States for actions
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // New admin form state
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminRole, setNewAdminRole] = useState<"ADMIN" | "MODERATOR">("ADMIN");
  const [teamActionLoading, setTeamActionLoading] = useState(false);

  // Document preview modal
  const [previewDocUrl, setPreviewDocUrl] = useState<string | null>(null);

  // Rejection modal
  const [rejectModalItem, setRejectModalItem] = useState<{ id: string; type: "kyc" | "innovation"; title: string } | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  // Load Dashboard Data
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Stats & Current Admin info
      const statsRes = await fetch("/api/admin/dashboard/stats");
      if (statsRes.status === 401) {
        window.location.href = "/admin";
        return;
      }
      const statsData = await statsRes.json();
      if (statsData.success) {
        setCurrentAdmin(statsData.admin);
        setStats(statsData.stats);
      }

      // 2. Fetch Seller KYC Queue
      const kycRes = await fetch(`/api/admin/kyc?filter=${kycFilter}`);
      const kycData = await kycRes.json();
      if (kycData.success) {
        setKycQueue(kycData.profiles || []);
      }

      // 3. Fetch Innovations
      const innoRes = await fetch(`/api/admin/innovations?filter=${innovationFilter}`);
      const innoData = await innoRes.json();
      if (innoData.success) {
        setInnovations(innoData.innovations || []);
      }

      // 4. Fetch Admin Team
      const teamRes = await fetch("/api/admin/team");
      const teamData = await teamRes.json();
      if (teamData.success) {
        setAdminTeam(teamData.team || []);
      }

      // 5. Fetch Audit Logs
      const logsRes = await fetch("/api/admin/audit-logs");
      const logsData = await logsRes.json();
      if (logsData.success) {
        setAuditLogs(logsData.logs || []);
      }
    } catch (err) {
      console.error("Dashboard data load error:", err);
      showToast("error", "Error connecting to Admin Management Service.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [kycFilter, innovationFilter]);

  const showToast = (type: "success" | "error", text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // ── Actions ───────────────────────────────────────────────────────────────
  // Handle KYC Approve/Reject
  const handleKycAction = async (profileId: string, action: "approve" | "reject", notes?: string) => {
    setActionLoadingId(profileId);
    try {
      const res = await fetch("/api/admin/kyc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId, action, notes }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", data.message || `KYC application ${action}d successfully.`);
        setRejectModalItem(null);
        setRejectReason("");
        loadDashboardData();
      } else {
        showToast("error", data.error || `Failed to ${action} KYC.`);
      }
    } catch {
      showToast("error", "Network error during KYC action.");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handle Innovation Approve/Reject
  const handleInnovationAction = async (innovationId: string, action: "approve" | "reject", notes?: string) => {
    setActionLoadingId(innovationId);
    try {
      const res = await fetch("/api/admin/innovations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ innovationId, action, notes }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", data.message || `Innovation ${action}d.`);
        setRejectModalItem(null);
        setRejectReason("");
        loadDashboardData();
      } else {
        showToast("error", data.error || `Failed to ${action} innovation.`);
      }
    } catch {
      showToast("error", "Network error updating innovation listing.");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handle Admin Promotion
  const handlePromoteAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim()) return;

    setTeamActionLoading(true);
    try {
      const res = await fetch("/api/admin/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "promote",
          email: newAdminEmail,
          role: newAdminRole,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", data.message || "Admin role updated successfully.");
        setNewAdminEmail("");
        loadDashboardData();
      } else {
        showToast("error", data.error || "Failed to assign admin role.");
      }
    } catch {
      showToast("error", "Network error during role assignment.");
    } finally {
      setTeamActionLoading(false);
    }
  };

  // Handle Revoke Admin Access
  const handleRevokeAdmin = async (email: string) => {
    if (!confirm(`Are you sure you want to revoke admin access for ${email}?`)) return;

    setTeamActionLoading(true);
    try {
      const res = await fetch("/api/admin/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "revoke",
          email,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", data.message || "Admin access revoked.");
        loadDashboardData();
      } else {
        showToast("error", data.error || "Failed to revoke access.");
      }
    } catch {
      showToast("error", "Network error during role revocation.");
    } finally {
      setTeamActionLoading(false);
    }
  };

  // Sign out admin
  const handleSignOut = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
    } catch {}
    window.location.href = "/admin";
  };

  const isSuperAdminUser = currentAdmin?.role === "SUPER_ADMIN";

  return (
    <div className="min-h-screen bg-[#080B11] text-gray-100 flex flex-col font-sans">
      {/* ── Top Command Bar ───────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#0D121D]/90 backdrop-blur-md border-b border-gray-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-500 p-0.5 shadow-md shadow-indigo-500/20">
            <div className="w-full h-full bg-[#080B11] rounded-[10px] flex items-center justify-center text-emerald-400">
              <Terminal size={18} />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-sm tracking-tight text-white">
                INNOVERSITY<span className="text-emerald-400">.OPS</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                2FA VALIDATED
              </span>
            </div>
            <p className="text-[10px] font-mono text-gray-400">Tier-0 Governance Command Center</p>
          </div>
        </div>

        {/* Admin Session Info & Sign Out */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-mono font-bold text-gray-200">{currentAdmin?.email || "innoversity98@gmail.com"}</span>
            <div className="flex items-center justify-end gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span
                className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded uppercase ${
                  isSuperAdminUser
                    ? "bg-purple-950/80 text-purple-300 border border-purple-500/40"
                    : "bg-indigo-950/80 text-indigo-300 border border-indigo-500/40"
                }`}
              >
                {currentAdmin?.role || "SUPER_ADMIN"}
              </span>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="px-3.5 py-2 rounded-xl bg-red-950/40 border border-red-500/30 hover:bg-red-900/50 text-red-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Terminate Admin Session"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Toast Notification Alert */}
      {toastMessage && (
        <div
          className={`fixed top-16 right-4 z-50 p-4 rounded-2xl border shadow-2xl flex items-center gap-3 text-xs font-mono max-w-md animate-fade-in ${
            toastMessage.type === "success"
              ? "bg-emerald-950/95 border-emerald-500/50 text-emerald-200"
              : "bg-red-950/95 border-red-500/50 text-red-200"
          }`}
        >
          {toastMessage.type === "success" ? <CheckCircle size={18} className="text-emerald-400" /> : <AlertTriangle size={18} />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* ── Main Dashboard Layout ─────────────────────────────────────────── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 space-y-6">
        {/* Metric Cards Banner */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#0D121D]/80 border border-gray-800/80 shadow-md space-y-1">
            <div className="flex items-center justify-between text-gray-400 text-xs font-mono">
              <span>Pending KYC Submissions</span>
              <FileCheck2 size={16} className="text-amber-400" />
            </div>
            <div className="text-2xl font-mono font-black text-amber-400">{stats.pendingKycCount}</div>
            <p className="text-[10px] text-gray-500 font-mono">Awaiting institutional sign-off</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#0D121D]/80 border border-gray-800/80 shadow-md space-y-1">
            <div className="flex items-center justify-between text-gray-400 text-xs font-mono">
              <span>Pending Inventions</span>
              <Lightbulb size={16} className="text-indigo-400" />
            </div>
            <div className="text-2xl font-mono font-black text-indigo-400">{stats.pendingInnovationsCount}</div>
            <p className="text-[10px] text-gray-500 font-mono">Awaiting marketplace release</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#0D121D]/80 border border-gray-800/80 shadow-md space-y-1">
            <div className="flex items-center justify-between text-gray-400 text-xs font-mono">
              <span>Active Marketplace Listings</span>
              <ShieldCheck size={16} className="text-emerald-400" />
            </div>
            <div className="text-2xl font-mono font-black text-emerald-400">{stats.totalActiveProducts}</div>
            <p className="text-[10px] text-gray-500 font-mono">Verified prototype catalog</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#0D121D]/80 border border-gray-800/80 shadow-md space-y-1">
            <div className="flex items-center justify-between text-gray-400 text-xs font-mono">
              <span>Command Team</span>
              <Users size={16} className="text-purple-400" />
            </div>
            <div className="text-2xl font-mono font-black text-purple-400">{stats.adminTeamCount}</div>
            <p className="text-[10px] text-gray-500 font-mono">RBAC delegated moderators</p>
          </div>
        </div>

        {/* ── Navigation Tabs ──────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 border-b border-gray-800/80 pb-3 flex-wrap">
          <button
            onClick={() => setActiveTab("KYC")}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "KYC"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
                : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/40"
            }`}
          >
            <FileCheck2 size={15} />
            <span>Seller KYC Queue</span>
            {stats.pendingKycCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-black text-[10px] font-black">
                {stats.pendingKycCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("INNOVATIONS")}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "INNOVATIONS"
                ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm"
                : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/40"
            }`}
          >
            <Lightbulb size={15} />
            <span>Innovation Approvals</span>
            {stats.pendingInnovationsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-indigo-500 text-white text-[10px] font-black">
                {stats.pendingInnovationsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("TEAM")}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "TEAM"
                ? "bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm"
                : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/40"
            }`}
          >
            <Users size={15} />
            <span>Admin Roles &amp; Team</span>
            {isSuperAdminUser && (
              <span className="px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 text-[10px] border border-purple-500/40 font-mono">
                SUPER
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("AUDIT")}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "AUDIT"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/40"
            }`}
          >
            <History size={15} />
            <span>Audit Trail</span>
          </button>

          <button
            onClick={loadDashboardData}
            disabled={loading}
            className="ml-auto p-2.5 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-white transition-all cursor-pointer"
            title="Reload Data"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {/* ── TAB 1: SELLER KYC QUEUE ───────────────────────────────────────── */}
        {activeTab === "KYC" && (
          <div className="space-y-4 animate-fade-in">
            {/* Filter Pills */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-gray-500">Filter Status:</span>
                {(["pending", "approved", "all"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setKycFilter(f)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono uppercase font-bold transition-all cursor-pointer ${
                      kycFilter === f
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                        : "bg-gray-800/40 text-gray-400 hover:text-gray-200"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search applicant / shop..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-4 py-1.5 rounded-xl bg-[#0D121D] border border-gray-800 text-xs font-mono text-white placeholder-gray-600 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* KYC Table / List */}
            {kycQueue.length === 0 ? (
              <div className="py-16 text-center rounded-3xl bg-[#0D121D]/50 border border-gray-800/80 space-y-2">
                <CheckCircle size={32} className="text-emerald-500 mx-auto opacity-70" />
                <p className="text-xs font-mono text-gray-400">All seller KYC applications are cleared.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {kycQueue
                  .filter((item) =>
                    searchQuery
                      ? (item.applicantName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (item.shopName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (item.institutionOrBusiness || "").toLowerCase().includes(searchQuery.toLowerCase())
                      : true
                  )
                  .map((item) => (
                    <div
                      key={item.id}
                      className="p-5 rounded-2xl bg-[#0D121D]/90 border border-gray-800/80 hover:border-gray-700 transition-all space-y-4"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs font-black text-white">{item.applicantName || "Applicant"}</span>
                            <span className="text-xs text-gray-500 font-mono">· {item.shopName}</span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                                item.verificationStatus === "admin_approved" || item.verificationStatus === "approved"
                                  ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/40"
                                  : item.verificationStatus === "rejected"
                                  ? "bg-red-950/80 text-red-300 border border-red-500/40"
                                  : "bg-amber-950/80 text-amber-300 border border-amber-500/40"
                              }`}
                            >
                              {item.verificationStatus}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 text-xs font-mono text-gray-400 flex-wrap">
                            <span className="flex items-center gap-1">
                              <Building size={12} className="text-indigo-400" />
                              {item.institutionOrBusiness}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin size={12} className="text-emerald-400" />
                              {item.district} District
                            </span>
                            <span className="text-gray-500">NIC: {item.nicNumber}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 self-end md:self-center">
                          {item.documentUrl && (
                            <button
                              onClick={() => setPreviewDocUrl(item.documentUrl)}
                              className="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                            >
                              <Eye size={13} />
                              <span>View Proof</span>
                            </button>
                          )}

                          {item.verificationStatus !== "admin_approved" && item.verificationStatus !== "approved" && (
                            <button
                              disabled={actionLoadingId === item.id}
                              onClick={() => handleKycAction(item.id, "approve")}
                              className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-md shadow-emerald-600/20"
                            >
                              <CheckCircle size={14} />
                              <span>Approve</span>
                            </button>
                          )}

                          {item.verificationStatus !== "rejected" && (
                            <button
                              disabled={actionLoadingId === item.id}
                              onClick={() =>
                                setRejectModalItem({
                                  id: item.id,
                                  type: "kyc",
                                  title: item.applicantName || item.shopName || "KYC Application",
                                })
                              }
                              className="px-3.5 py-1.5 rounded-xl bg-red-950/40 border border-red-500/40 hover:bg-red-900/50 text-red-300 font-mono font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                            >
                              <XCircle size={14} />
                              <span>Reject</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {item.notes && (
                        <div className="p-3 rounded-xl bg-[#080B11] border border-gray-800/80 text-[11px] font-mono text-gray-400">
                          <span className="text-gray-500">Notes / Audit Trail:</span> {item.notes}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 2: INNOVATION APPROVALS ──────────────────────────────────── */}
        {activeTab === "INNOVATIONS" && (
          <div className="space-y-4 animate-fade-in">
            {/* Filter Pills */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-gray-500">Filter:</span>
                {(["pending", "active", "all"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setInnovationFilter(f)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono uppercase font-bold transition-all cursor-pointer ${
                      innovationFilter === f
                        ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40"
                        : "bg-gray-800/40 text-gray-400 hover:text-gray-200"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {innovations.length === 0 ? (
              <div className="py-16 text-center rounded-3xl bg-[#0D121D]/50 border border-gray-800/80 space-y-2">
                <CheckCircle size={32} className="text-emerald-500 mx-auto opacity-70" />
                <p className="text-xs font-mono text-gray-400">No innovation listings awaiting review.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {innovations.map((inno) => (
                  <div
                    key={inno.id}
                    className="p-5 rounded-2xl bg-[#0D121D]/90 border border-gray-800/80 hover:border-gray-700 transition-all space-y-3"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-mono font-bold text-sm text-white">{inno.title}</h3>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                              inno.status === "active"
                                ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/40"
                                : inno.status === "rejected"
                                ? "bg-red-950/80 text-red-300 border border-red-500/40"
                                : "bg-indigo-950/80 text-indigo-300 border border-indigo-500/40"
                            }`}
                          >
                            {inno.status}
                          </span>
                        </div>

                        <p className="text-xs font-mono text-gray-400 line-clamp-2">{inno.description}</p>

                        <div className="flex items-center gap-4 text-xs font-mono text-gray-400 flex-wrap pt-1">
                          <span>
                            Seller: <strong className="text-gray-200">{inno.sellerName}</strong> ({inno.institution})
                          </span>
                          <span className="text-emerald-400 font-bold">Rs. {inno.price.toLocaleString()}</span>
                          <span className="px-2 py-0.5 rounded bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-[10px]">
                            {inno.supervisorEndorsement}
                          </span>
                        </div>
                      </div>

                      {/* Approve / Reject Buttons */}
                      <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0">
                        {inno.status !== "active" && (
                          <button
                            disabled={actionLoadingId === inno.id}
                            onClick={() => handleInnovationAction(inno.id, "approve")}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-md shadow-emerald-600/20"
                          >
                            <CheckCircle size={14} />
                            <span>Approve (Live)</span>
                          </button>
                        )}

                        {inno.status !== "rejected" && (
                          <button
                            disabled={actionLoadingId === inno.id}
                            onClick={() =>
                              setRejectModalItem({
                                id: inno.id,
                                type: "innovation",
                                title: inno.title,
                              })
                            }
                            className="px-3.5 py-2 rounded-xl bg-red-950/40 border border-red-500/40 hover:bg-red-900/50 text-red-300 font-mono font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                          >
                            <XCircle size={14} />
                            <span>Reject</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 3: ADMIN ROLES & TEAM (SUPER_ADMIN ONLY) ────────────────── */}
        {activeTab === "TEAM" && (
          <div className="space-y-6 animate-fade-in">
            {/* Super Admin Authorization Card */}
            {!isSuperAdminUser ? (
              <div className="p-6 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-300 flex items-start gap-3">
                <BadgeAlert size={20} className="shrink-0 mt-0.5 text-amber-400" />
                <div className="space-y-1">
                  <h4 className="font-mono font-bold text-sm">Privileged Action Restricted</h4>
                  <p className="text-xs font-mono text-amber-200/80 leading-relaxed">
                    Only the Main Super Admin (<strong>innoversity98@gmail.com</strong>) has authorization to promote, delegate, or revoke administrative roles in Innoversity Command Center.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-3xl bg-[#0D121D]/90 border border-purple-500/30 space-y-4 shadow-xl">
                <div className="flex items-center gap-2">
                  <UserPlus size={18} className="text-purple-400" />
                  <h3 className="font-mono font-bold text-sm text-white">Delegate New Admin / Moderator</h3>
                </div>
                <p className="text-xs font-mono text-gray-400">
                  Assign administrative capabilities by registered email. Promoted users must complete 2FA on their next login.
                </p>

                <form onSubmit={handlePromoteAdmin} className="flex flex-col sm:flex-row gap-3 pt-2">
                  <input
                    type="email"
                    required
                    placeholder="officer@innoversity.lk"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-[#080B11] border border-gray-800 text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                  />

                  <select
                    value={newAdminRole}
                    onChange={(e) => setNewAdminRole(e.target.value as any)}
                    className="px-3 py-2.5 rounded-xl bg-[#080B11] border border-gray-800 text-xs font-mono text-purple-300 focus:outline-none focus:border-purple-500"
                  >
                    <option value="ADMIN">ADMIN (Full Reviewer)</option>
                    <option value="MODERATOR">MODERATOR (Auditor)</option>
                  </select>

                  <button
                    type="submit"
                    disabled={teamActionLoading}
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md shadow-purple-600/30"
                  >
                    <UserPlus size={14} />
                    <span>Assign Role</span>
                  </button>
                </form>
              </div>
            )}

            {/* Current Team Roster */}
            <div className="space-y-3">
              <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-gray-400">
                Active Command Officers ({adminTeam.length})
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {adminTeam.map((member) => (
                  <div
                    key={member.id}
                    className="p-4 rounded-2xl bg-[#0D121D]/90 border border-gray-800/80 flex items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-white">{member.fullName || member.email}</span>
                        <span
                          className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded uppercase ${
                            member.role === "SUPER_ADMIN"
                              ? "bg-purple-950 text-purple-300 border border-purple-500/40"
                              : member.role === "ADMIN"
                              ? "bg-indigo-950 text-indigo-300 border border-indigo-500/40"
                              : "bg-teal-950 text-teal-300 border border-teal-500/40"
                          }`}
                        >
                          {member.role}
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-gray-500">{member.email}</p>
                    </div>

                    {isSuperAdminUser && member.role !== "SUPER_ADMIN" && (
                      <button
                        onClick={() => handleRevokeAdmin(member.email)}
                        disabled={teamActionLoading}
                        className="px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-500/30 hover:bg-red-900/50 text-red-300 text-xs font-mono font-semibold flex items-center gap-1 cursor-pointer transition-all"
                      >
                        <UserX size={12} />
                        <span>Revoke</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 4: AUDIT TRAIL ────────────────────────────────────────────── */}
        {activeTab === "AUDIT" && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-gray-400">
                Immutable Governance Log
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <ShieldCheck size={12} /> Cryptographically Signed
              </span>
            </div>

            <div className="rounded-2xl bg-[#0D121D]/90 border border-gray-800/80 overflow-hidden divide-y divide-gray-800/60 font-mono text-xs">
              {auditLogs.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No actions recorded yet.</div>
              ) : (
                auditLogs.map((log) => (
                  <div key={log.id} className="p-3.5 hover:bg-gray-800/30 transition-all space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-gray-400 flex-wrap gap-2">
                      <span className="text-indigo-400 font-bold">{log.adminEmail}</span>
                      <span className="px-1.5 py-0.2 rounded bg-gray-800 text-gray-300 uppercase font-black text-[9px]">
                        {log.action}
                      </span>
                      <span className="text-gray-500">{new Date(log.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-gray-300 text-[11px]">{log.details}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      {/* ── Document Preview Modal ────────────────────────────────────────── */}
      {previewDocUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D121D] border border-gray-800 rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h4 className="font-mono font-bold text-sm text-white">Student ID / BR Document Proof</h4>
              <button
                onClick={() => setPreviewDocUrl(null)}
                className="text-gray-400 hover:text-white cursor-pointer font-mono text-sm"
              >
                ✕ Close
              </button>
            </div>

            <div className="max-h-[60vh] overflow-auto rounded-xl border border-gray-800 flex items-center justify-center bg-black/40">
              <img src={previewDocUrl} alt="KYC Proof" className="max-w-full h-auto object-contain" />
            </div>

            <div className="flex justify-end">
              <a
                href={previewDocUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-mono text-gray-200 flex items-center gap-1.5"
              >
                <ExternalLink size={14} />
                <span>Open in New Tab</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── Rejection Modal with Notes ────────────────────────────────────── */}
      {rejectModalItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D121D] border border-red-500/40 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-fade-in font-mono">
            <div className="flex items-center gap-2 text-red-400 text-sm font-bold">
              <XCircle size={18} />
              <span>Confirm Rejection</span>
            </div>

            <p className="text-xs text-gray-300">
              You are rejecting <strong>&quot;{rejectModalItem.title}&quot;</strong>. Please provide a clear audit justification:
            </p>

            <textarea
              rows={3}
              required
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Blurred institutional credential or missing faculty supervisor signature."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B11] border border-gray-800 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-red-500"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectModalItem(null)}
                className="px-4 py-2 rounded-xl border border-gray-800 text-gray-400 hover:text-white text-xs cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={actionLoadingId === rejectModalItem.id}
                onClick={() => {
                  if (rejectModalItem.type === "kyc") {
                    handleKycAction(rejectModalItem.id, "reject", rejectReason);
                  } else {
                    handleInnovationAction(rejectModalItem.id, "reject", rejectReason);
                  }
                }}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <XCircle size={14} />
                <span>Confirm Rejection</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

