"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  Shield,
  Users,
  Gift,
  Music,
  Plus,
  Trash2,
  Send,
  AlertTriangle,
  CheckCircle,
  Copy,
  Sparkles,
  Upload,
  Play,
  RotateCcw,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Edit3,
  Star,
  Bell,
  Mail,
  Crown,
  X,
} from "lucide-react";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { getStripe } from "@/lib/stripe-client";

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Participant {
  id: string;
  status: string;
  confirmedAt?: string;
  user: Member;
}

interface Exclusion {
  id: string;
  userA: { id: string; name: string };
  userB: { id: string; name: string };
  reason?: string;
}

interface Exchange {
  id: string;
  name: string;
  year: number;
  budget: number;
  currency: string;
  exchangeDate: string;
  status: string;
  location?: string;
  drawnAt?: string;
  instructions?: string;
  isPremium?: boolean;
  participants: Participant[];
  exclusions: Exclusion[];
}

interface MusicTrack {
  id: string;
  title: string;
  artist?: string;
  category: string;
  source: string;
  filePath: string;
  sortOrder?: number;
}

interface PendingInvitation {
  id: string;
  email: string;
  token?: string;
  status: string;
  expiresAt: string;
  createdAt: string;
}

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [exchange, setExchange] = useState<Exchange | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [pendingInvitations, setPendingInvitations] = useState<PendingInvitation[]>([]);
  const [remindingAll, setRemindingAll] = useState(false);
  const [remindingId, setRemindingId] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [upgrading, setUpgrading] = useState(false);
  const [checkoutClientSecret, setCheckoutClientSecret] = useState<string | null>(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  // Invite form state
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [lastInviteLink, setLastInviteLink] = useState<string | null>(null);

  // New exchange form modal state
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [newExName, setNewExName] = useState("Family Christmas Exchange");
  const [newExYear, setNewExYear] = useState(new Date().getFullYear().toString());
  const [newExBudget, setNewExBudget] = useState("30");
  const [newExDate, setNewExDate] = useState(`${new Date().getFullYear()}-12-25`);
  const [newExInstructions, setNewExInstructions] = useState("Please wrap your gift and label it for your recipient!");
  const [creatingExchange, setCreatingExchange] = useState(false);

  // Edit exchange modal state
  const [showEditExchangeModal, setShowEditExchangeModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBudget, setEditBudget] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editInstructions, setEditInstructions] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  // Exclusion modal state
  const [showExclusionModal, setShowExclusionModal] = useState(false);
  const [userAId, setUserAId] = useState("");
  const [userBId, setUserBId] = useState("");
  const [exclusionReason, setExclusionReason] = useState("Spouse / Partner");
  const [addingExclusion, setAddingExclusion] = useState(false);

  // Drawing state
  const [drawingLoading, setDrawingLoading] = useState(false);
  const [showDrawConfirm, setShowDrawConfirm] = useState(false);

  // Reset drawing modal state
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetConfirmCode, setResetConfirmCode] = useState("");
  const [resetting, setResetting] = useState(false);

  // Music upload state
  const [showMusicModal, setShowMusicModal] = useState(false);
  const [musicTitle, setMusicTitle] = useState("");
  const [musicArtist, setMusicArtist] = useState("");
  const [musicCategory, setMusicCategory] = useState("FESTIVE");
  const [musicFile, setMusicFile] = useState<File | null>(null);
  const [musicIsDefault, setMusicIsDefault] = useState(false);
  const [uploadingMusic, setUploadingMusic] = useState(false);

  // Audio preview element
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const [previewTrackId, setPreviewTrackId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      // 1. Fetch family details
      const famRes = await fetch("/api/family");
      const famData = await famRes.json();
      const primaryMembership = famData.memberships?.[0];
      const primaryGroup = primaryMembership?.familyGroup;

      if (primaryGroup) {
        const mems = primaryGroup.memberships.map((m: { user: Member }) => m.user);
        setMembers(mems);

        if (Array.isArray(primaryGroup.invitations)) {
          // Exclude any invitation whose email already belongs to a registered member
          const activeEmails = new Set(mems.map((m: Member) => m.email.toLowerCase()));
          const truePending = primaryGroup.invitations.filter(
            (inv: PendingInvitation) => !activeEmails.has(inv.email.toLowerCase())
          );
          setPendingInvitations(truePending);
        }

        if (primaryGroup.exchanges && primaryGroup.exchanges.length > 0) {
          const currentEx = primaryGroup.exchanges[0];
          // Directly fetch exclusions to guarantee latest list
          try {
            const exRes = await fetch(`/api/exchange/${currentEx.id}/exclusions`);
            if (exRes.ok) {
              const exData = await exRes.json();
              if (Array.isArray(exData.exclusions)) {
                currentEx.exclusions = exData.exclusions;
              }
            }
          } catch {
            // Keep currentEx.exclusions if already present
          }
          setExchange(currentEx);
        }
      }

      // 2. Fetch music tracks
      const musRes = await fetch("/api/music");
      if (musRes.ok) {
        const musData = await musRes.json();
        setTracks(musData);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("upgraded") === "true") {
        setSuccess("👑 Host Pass Activated! Your exchange is now upgraded with unlimited members and premium tools.");
      }
    }
  }, []);

  // Upgrade to Host Pass via In-App Stripe Embedded Checkout
  const handleUpgradeHostPass = async () => {
    if (!exchange) return;
    setUpgrading(true);
    setError(null);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exchangeId: exchange.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to start checkout");
      if (data.clientSecret) {
        setCheckoutClientSecret(data.clientSecret);
        setShowCheckoutModal(true);
      } else if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to initiate Host Pass upgrade");
    } finally {
      setUpgrading(false);
    }
  };

  // Send Family Invitation
  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    setInviting(true);
    setError(null);
    setSuccess(null);

    try {
      const famRes = await fetch("/api/family");
      const famData = await famRes.json();
      const groupId = famData.memberships?.[0]?.familyGroupId;

      const res = await fetch("/api/family/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ familyGroupId: groupId, email: inviteEmail }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to invite");

      setSuccess(`Invitation created for ${inviteEmail}!`);
      setLastInviteLink(data.invite.inviteUrl);
      setInviteEmail("");
      loadData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to invite");
    } finally {
      setInviting(false);
    }
  };

  // Send Follow-Up Reminders
  const handleSendReminder = async (invitationId?: string) => {
    try {
      if (invitationId) {
        setRemindingId(invitationId);
      } else {
        setRemindingAll(true);
      }
      setError(null);
      setSuccess(null);

      const famRes = await fetch("/api/family");
      const famData = await famRes.json();
      const groupId = famData.memberships?.[0]?.familyGroupId;

      const res = await fetch("/api/family/invite/remind", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          familyGroupId: groupId,
          invitationId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send reminders");

      setSuccess(data.message || "Follow-up invitations dispatched!");
      await loadData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send reminders");
    } finally {
      setRemindingAll(false);
      setRemindingId(null);
    }
  };

  // Delete / Cancel Invitation
  const handleDeleteInvite = async (invitationId: string) => {
    if (!confirm("Are you sure you want to remove this pending invitation?")) return;
    try {
      const res = await fetch(`/api/family/invite?id=${invitationId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSuccess("Invitation removed.");
        await loadData();
      } else {
        const data = await res.json();
        throw new Error(data.error || "Failed to remove invitation");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to remove invitation");
    }
  };

  // Create New Exchange
  const handleCreateExchange = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingExchange(true);
    setError(null);

    try {
      const famRes = await fetch("/api/family");
      const famData = await famRes.json();
      const groupId = famData.memberships?.[0]?.familyGroupId;

      const res = await fetch("/api/exchange", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          familyGroupId: groupId,
          name: newExName,
          year: newExYear,
          budget: newExBudget,
          exchangeDate: newExDate,
          instructions: newExInstructions,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create exchange");

      setSuccess("New Christmas gift exchange created!");
      setShowExchangeModal(false);
      loadData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create exchange");
    } finally {
      setCreatingExchange(false);
    }
  };

  // Open Edit Modal pre-populated
  const openEditModal = () => {
    if (!exchange) return;
    setEditName(exchange.name);
    setEditBudget(exchange.budget.toString());
    setEditDate(new Date(exchange.exchangeDate).toISOString().split("T")[0]);
    setEditLocation(exchange.location || "");
    setEditInstructions(exchange.instructions || "");
    setShowEditExchangeModal(true);
  };

  // Save Edit Exchange
  const handleSaveExchangeEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exchange) return;
    setSavingEdit(true);
    setError(null);

    try {
      const res = await fetch("/api/exchange", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exchangeId: exchange.id,
          name: editName,
          budget: editBudget,
          currency: exchange.currency,
          exchangeDate: editDate,
          location: editLocation,
          instructions: editInstructions,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update exchange");

      setSuccess("Exchange settings updated successfully!");
      setShowEditExchangeModal(false);
      loadData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update exchange");
    } finally {
      setSavingEdit(false);
    }
  };

  // Add Exclusion
  const handleAddExclusion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exchange || !userAId || !userBId) return;

    setAddingExclusion(true);
    setError(null);

    try {
      const res = await fetch(`/api/exchange/${exchange.id}/exclusions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userAId, userBId, reason: exclusionReason }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add exclusion");

      setSuccess("Exclusion rule saved!");
      setShowExclusionModal(false);
      setUserAId("");
      setUserBId("");
      await loadData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to add exclusion");
    } finally {
      setAddingExclusion(false);
    }
  };

  // Delete Exclusion
  const handleDeleteExclusion = async (ruleId: string) => {
    if (!exchange) return;
    try {
      const res = await fetch(`/api/exchange/${exchange.id}/exclusions?ruleId=${ruleId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await loadData();
      }
    } catch {
      // Error
    }
  };

  // Start Drawing
  const handleExecuteDrawing = async () => {
    if (!exchange) return;
    setDrawingLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`/api/exchange/${exchange.id}/draw`, {
        method: "POST",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to execute drawing");

      setSuccess(data.message || "Names drawn successfully!");
      setShowDrawConfirm(false);
      loadData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Drawing failed");
    } finally {
      setDrawingLoading(false);
    }
  };

  // Reset Drawing (Emergency Override)
  const handleResetDrawing = async () => {
    if (!exchange || resetConfirmCode !== "CONFIRM_RESET_DRAWING") return;
    setResetting(true);
    setError(null);

    try {
      const res = await fetch(`/api/exchange/${exchange.id}/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmationText: resetConfirmCode }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reset drawing");

      setSuccess("Drawing has been reset safely.");
      setShowResetModal(false);
      setResetConfirmCode("");
      loadData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Reset failed");
    } finally {
      setResetting(false);
    }
  };

  // Upload Music Track
  const handleUploadMusic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!musicFile || !musicTitle.trim()) return;

    setUploadingMusic(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", musicFile);
      formData.append("title", musicTitle);
      formData.append("artist", musicArtist);
      formData.append("category", musicCategory);
      formData.append("isDefault", musicIsDefault.toString());

      const res = await fetch("/api/music", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setSuccess(`Music track "${musicTitle}" uploaded successfully!`);
      setShowMusicModal(false);
      setMusicTitle("");
      setMusicArtist("");
      setMusicFile(null);
      setMusicIsDefault(false);
      loadData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingMusic(false);
    }
  };

  // Set as Default Music Track
  const handleSetDefaultMusic = async (trackId: string, currentIsDefault: boolean) => {
    try {
      setError(null);
      const res = await fetch("/api/music", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: trackId,
          isDefault: !currentIsDefault,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update default track");

      setSuccess(!currentIsDefault ? "Track set as default starting music!" : "Default track cleared.");
      loadData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update default track");
    }
  };

  // Delete Music Track
  const handleDeleteMusic = async (id: string) => {
    try {
      const res = await fetch(`/api/music?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setTracks((prev) => prev.filter((t) => t.id !== id));
      }
    } catch {
      // Error
    }
  };

  // Toggle track preview
  const handleTogglePreview = (track: MusicTrack) => {
    if (previewTrackId === track.id) {
      if (previewAudioRef.current) previewAudioRef.current.pause();
      setPreviewTrackId(null);
    } else {
      if (previewAudioRef.current) {
        previewAudioRef.current.src = track.filePath;
        previewAudioRef.current.play();
        setPreviewTrackId(track.id);
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto my-16 text-center text-[#f3c053] space-y-3">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#d4af37]" />
        <p>Loading Admin Dashboard...</p>
      </div>
    );
  }

  const confirmedCount = exchange?.participants.filter((p) => p.status === "CONFIRMED").length || 0;
  const isReadyToDraw = confirmedCount >= 3 && exchange?.status !== "DRAWN" && exchange?.status !== "COMPLETED";

  return (
    <div className="space-y-8 py-4 sm:py-6 max-w-6xl mx-auto">
      <audio ref={previewAudioRef} onEnded={() => setPreviewTrackId(null)} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#1d5943] pb-6">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center space-x-1.5 text-xs text-slate-300 hover:text-[#d4af37] transition mb-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Circle Dashboard</span>
          </Link>
          <h1 className="text-3xl font-bold text-[#fef9ee] font-festive flex items-center space-x-2">
            <Shield className="w-7 h-7 text-[#d4af37]" />
            <span>Host Control Center</span>
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Manage your gift circle, configure exclusions, draw names, and customize your exchange.
          </p>
        </div>

        <button
          onClick={() => setShowExchangeModal(true)}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#144534] hover:bg-[#1d5943] border border-[#d4af37]/40 text-[#f3c053] font-bold text-xs shadow"
        >
          <Plus className="w-4 h-4 text-[#d4af37]" />
          <span>New Exchange Year</span>
        </button>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 rounded-xl bg-red-950/70 border border-red-800 text-red-200 text-sm flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-200 text-sm flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 shrink-0 text-[#d4af37]" />
          <span>{success}</span>
        </div>
      )}

      {/* Top Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="festive-card p-4 rounded-xl border border-[#1d5943]">
          <div className="text-xs text-slate-400">Total Members</div>
          <div className="text-2xl font-bold text-[#fef9ee] mt-1">{members.length}</div>
        </div>

        <div className="festive-card p-4 rounded-xl border border-[#1d5943]">
          <div className="text-xs text-slate-400">Confirmed for Drawing</div>
          <div className="text-2xl font-bold text-emerald-300 mt-1">{confirmedCount}</div>
        </div>

        <div className="festive-card p-4 rounded-xl border border-[#1d5943]">
          <div className="text-xs text-slate-400">Drawing Status</div>
          <div className="text-sm font-bold text-[#f3c053] mt-2 uppercase">
            {exchange?.status || "None"}
          </div>
        </div>

        <div className="festive-card p-4 rounded-xl border border-[#1d5943]">
          <div className="text-xs text-slate-400">Exclusion Rules</div>
          <div className="text-2xl font-bold text-[#fef9ee] mt-1">
            {exchange?.exclusions?.length || 0}
          </div>
        </div>
      </div>

      {/* Main Exchange Control & Drawing Action */}
      {exchange ? (
        <div className="festive-card p-6 sm:p-8 rounded-2xl border-2 border-[#d4af37]/40 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#1d5943] pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-[#f3c053] uppercase tracking-wider">
                  Active Exchange &bull; Christmas {exchange.year}
                </span>
                <button
                  onClick={openEditModal}
                  className="px-2 py-0.5 rounded bg-[#144534] hover:bg-[#1d5943] border border-[#d4af37]/40 text-[11px] text-[#f3c053] flex items-center space-x-1 transition shadow-sm"
                  title="Edit Exchange Settings"
                >
                  <Edit3 className="w-3 h-3 text-[#d4af37]" />
                  <span>Edit Settings</span>
                </button>
              </div>
              <h2 className="text-2xl font-bold text-[#fef9ee] font-festive">{exchange.name}</h2>
              <div className="text-xs text-slate-300 mt-1">
                Budget: ${Number(exchange.budget).toFixed(2)} {exchange.currency} &bull; Date: {new Date(exchange.exchangeDate).toLocaleDateString()}
              </div>
            </div>

            {/* Drawing Button */}
            {exchange.status !== "DRAWN" && exchange.status !== "COMPLETED" ? (
              <button
                onClick={() => setShowDrawConfirm(true)}
                disabled={!isReadyToDraw || drawingLoading}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#d4af37] hover:bg-[#f3c053] text-[#0b2b20] font-bold text-sm transition shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {drawingLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>Start Secret Santa Drawing</span>
              </button>
            ) : (
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-bold">
                  ✓ Drawing Finalized ({new Date(exchange.drawnAt || "").toLocaleDateString()})
                </span>
                <button
                  onClick={() => setShowResetModal(true)}
                  className="px-3 py-1.5 rounded-lg border border-red-800/80 hover:bg-red-950/40 text-red-300 text-xs font-semibold flex items-center space-x-1"
                  title="Emergency reset of drawn assignments"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Drawing</span>
                </button>
              </div>
            )}
          </div>

          {/* Host Pass Upgrade / Status Card */}
          {exchange.isPremium ? (
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#d4af37]/20 via-[#144534] to-[#d4af37]/20 border border-[#d4af37] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-[#d4af37] text-[#0b2b20] flex items-center justify-center font-bold shrink-0">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#fef9ee] flex items-center space-x-2">
                    <span>👑 Host Pass Active</span>
                    <span className="text-[10px] bg-[#d4af37] text-[#0b2b20] px-1.5 py-0.5 rounded font-extrabold uppercase">PRO</span>
                  </div>
                  <p className="text-xs text-[#f3c053]">
                    Unlimited participants, 1-click reminders, and priority email delivery are fully active.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#144534] via-[#0b2b20] to-[#144534] border border-[#d4af37]/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#d4af37]/10 border border-[#d4af37] text-[#d4af37] flex items-center justify-center font-bold shrink-0">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#fef9ee] flex items-center space-x-2">
                    <span>Upgrade to Host Pass</span>
                    <span className="text-xs font-bold text-[#d4af37] px-2 py-0.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30">
                      $7.99 one-time
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Unlock unlimited circle members, 1-click follow-up reminders, custom reveal effects, and priority Brevo delivery.
                  </p>
                </div>
              </div>
              <button
                onClick={handleUpgradeHostPass}
                disabled={upgrading}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#d4af37] hover:bg-[#f3c053] text-[#0b2b20] font-bold text-xs shadow-lg transition flex items-center justify-center space-x-1.5 whitespace-nowrap disabled:opacity-50 cursor-pointer"
              >
                {upgrading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Crown className="w-3.5 h-3.5" />}
                <span>{upgrading ? "Redirecting to Stripe..." : "Upgrade for $7.99"}</span>
              </button>
            </div>
          )}

          {!isReadyToDraw && exchange.status !== "DRAWN" && (
            <div className="p-4 rounded-xl bg-[#0b2b20] border border-[#1d5943] text-xs text-amber-300 flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>
                At least 3 confirmed participants are required to run the drawing. Currently confirmed: {confirmedCount}.
              </span>
            </div>
          )}

          {/* Exclusions Section */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#fef9ee] font-festive">
                  Exclusion Rules ({exchange.exclusions?.length || 0})
                </h3>
                <p className="text-xs text-slate-300">
                  Prevent spouses, partners, or specific family members from drawing each other.
                </p>
              </div>

              {exchange.status !== "DRAWN" && (
                <button
                  onClick={() => setShowExclusionModal(true)}
                  className="px-3 py-1.5 rounded-lg bg-[#144534] hover:bg-[#1d5943] border border-[#d4af37]/40 text-xs text-[#f3c053] font-semibold flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Exclusion</span>
                </button>
              )}
            </div>

            {exchange.exclusions && exchange.exclusions.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {exchange.exclusions.map((ex) => (
                  <div
                    key={ex.id}
                    className="p-3 rounded-xl bg-[#0b2b20]/70 border border-[#1d5943] flex items-center justify-between"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-200">
                        {ex.userA.name} &harr; {ex.userB.name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {ex.reason || "Cannot draw each other"}
                      </div>
                    </div>

                    {exchange.status !== "DRAWN" && (
                      <button
                        onClick={() => handleDeleteExclusion(ex.id)}
                        className="p-1 text-slate-400 hover:text-red-400"
                        title="Remove rule"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                No exclusions configured. Any participant can draw any other participant.
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="festive-card p-8 rounded-2xl text-center space-y-4 border-2 border-dashed border-[#1d5943]">
          <div className="text-4xl">🎄</div>
          <h3 className="text-xl font-bold text-[#fef9ee] font-festive">No Active Christmas Exchange</h3>
          <p className="text-sm text-slate-300 max-w-md mx-auto">
            You don&apos;t have an exchange scheduled yet for your family. Create one to begin inviting participants, configuring gift budgets, and setting exclusions!
          </p>
          <button
            onClick={() => setShowExchangeModal(true)}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-[#d4af37] hover:bg-[#f3c053] text-[#0b2b20] font-bold text-sm shadow-lg transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create Christmas Exchange</span>
          </button>
        </div>
      )}

      {/* Family Member & Invitations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Invite by Email */}
        <div className="festive-card p-6 rounded-2xl space-y-4">
          <div className="border-b border-[#1d5943] pb-3">
            <h3 className="text-base font-bold text-[#fef9ee] font-festive flex items-center space-x-2">
              <Send className="w-4 h-4 text-[#d4af37]" />
              <span>Invite Family Member</span>
            </h3>
            <p className="text-xs text-slate-300">
              Send an email invitation link to join this private family group.
            </p>
          </div>

          <form onSubmit={handleInvite} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="inviteEmail">
                Family Member&apos;s Email
              </label>
              <input
                id="inviteEmail"
                type="email"
                required
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="cousin@family.com"
                className="w-full px-3 py-2 rounded-lg bg-[#0b2b20] border border-[#1d5943] text-sm text-slate-100 placeholder-slate-500 focus:border-[#d4af37] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={inviting}
              className="w-full py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#f3c053] text-[#0b2b20] font-bold text-xs transition shadow flex items-center justify-center space-x-1.5 disabled:opacity-50"
            >
              {inviting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{inviting ? "Sending..." : "Create & Send Invitation"}</span>
            </button>
          </form>

          {lastInviteLink && (
            <div className="p-3 rounded-xl bg-[#0b2b20] border border-[#d4af37]/30 space-y-1">
              <div className="text-[11px] text-[#f3c053] font-semibold">Shareable Invitation Link:</div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  readOnly
                  value={lastInviteLink}
                  className="w-full px-2 py-1 text-xs bg-[#144534] border border-[#1d5943] rounded text-slate-200 select-all"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(lastInviteLink);
                    alert("Invite link copied to clipboard!");
                  }}
                  className="p-1.5 bg-[#d4af37] text-[#0b2b20] rounded hover:bg-[#f3c053]"
                  title="Copy link"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Pending Invitations & Follow-Up Reminders */}
          {pendingInvitations.length > 0 && (
            <div className="pt-4 border-t border-[#1d5943] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#fef9ee] flex items-center space-x-1.5">
                    <Bell className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Awaiting Response ({pendingInvitations.length})</span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Members invited who have not yet responded
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSendReminder()}
                  disabled={remindingAll}
                  className="px-3 py-1.5 rounded-lg bg-[#144534] hover:bg-[#1d5943] border border-[#d4af37]/40 text-xs text-[#f3c053] font-semibold flex items-center space-x-1 disabled:opacity-50 transition"
                  title="Send follow-up reminder emails to all pending invites"
                >
                  {remindingAll ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Bell className="w-3 h-3 text-[#d4af37]" />
                  )}
                  <span>{remindingAll ? "Sending..." : "Remind All"}</span>
                </button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {pendingInvitations.map((inv) => {
                  const inviteUrl = inv.token
                    ? `${typeof window !== "undefined" ? window.location.origin : ""}/invite/${inv.token}`
                    : "";
                  const isCopied = copiedToken === inv.id;
                  const isRemindingThis = remindingId === inv.id;

                  return (
                    <div
                      key={inv.id}
                      className="p-2.5 rounded-xl bg-[#0b2b20]/80 border border-[#1d5943] flex items-center justify-between text-xs"
                    >
                      <div className="truncate mr-2">
                        <div className="font-semibold text-slate-200 truncate flex items-center space-x-1.5">
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{inv.email}</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Expires {new Date(inv.expiresAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex items-center space-x-1.5 shrink-0">
                        {inv.token && (
                          <button
                            type="button"
                            onClick={() => {
                              if (inviteUrl) {
                                navigator.clipboard.writeText(inviteUrl);
                                setCopiedToken(inv.id);
                                setTimeout(() => setCopiedToken(null), 2500);
                              }
                            }}
                            className="px-2 py-1 rounded bg-[#144534] hover:bg-[#1d5943] text-slate-300 text-[11px] font-medium border border-[#1d5943] flex items-center space-x-1 transition"
                            title="Copy personal invite link"
                          >
                            <Copy className="w-3 h-3 text-[#d4af37]" />
                            <span>{isCopied ? "Copied!" : "Copy"}</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleSendReminder(inv.id)}
                          disabled={isRemindingThis}
                          className="px-2.5 py-1 rounded bg-[#d4af37] hover:bg-[#f3c053] text-[#0b2b20] text-[11px] font-bold flex items-center space-x-1 disabled:opacity-50 transition"
                          title="Send follow-up reminder email"
                        >
                          {isRemindingThis ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Bell className="w-3 h-3" />
                          )}
                          <span>{isRemindingThis ? "..." : "Remind"}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteInvite(inv.id)}
                          className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-red-950/30 transition"
                          title="Cancel invitation"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Music Management */}
        <div className="festive-card p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#1d5943] pb-3">
            <div>
              <h3 className="text-base font-bold text-[#fef9ee] font-festive flex items-center space-x-2">
                <Music className="w-4 h-4 text-[#d4af37]" />
                <span>Christmas Music ({tracks.length})</span>
              </h3>
              <p className="text-xs text-slate-300">Upload custom MP3/OGG/WAV tracks</p>
            </div>

            <button
              onClick={() => setShowMusicModal(true)}
              className="px-3 py-1.5 rounded-lg bg-[#144534] hover:bg-[#1d5943] border border-[#d4af37]/40 text-xs text-[#f3c053] font-semibold flex items-center space-x-1"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Track</span>
            </button>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {tracks.map((t) => (
              <div
                key={t.id}
                className="p-2.5 rounded-xl bg-[#0b2b20]/70 border border-[#1d5943] flex items-center justify-between"
              >
                <div className="flex items-center space-x-2 truncate">
                  <button
                    onClick={() => handleTogglePreview(t)}
                    className="p-1.5 rounded-full bg-[#144534] text-[#d4af37] hover:bg-[#1d5943]"
                    title="Preview Track"
                  >
                    <Play className="w-3 h-3" />
                  </button>
                  <div className="truncate">
                    <div className="text-xs font-semibold text-slate-200 truncate flex items-center space-x-1.5">
                      <span className="truncate">{t.title}</span>
                      {t.sortOrder !== undefined && t.sortOrder < 0 && (
                        <span className="shrink-0 px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-bold">
                          ⭐ Default
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-[#f3c053]">{t.artist ? `${t.artist} • ` : ""}{t.category} &bull; {t.source}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => handleSetDefaultMusic(t.id, t.sortOrder !== undefined && t.sortOrder < 0)}
                    className={`px-2 py-1 rounded text-[10px] font-bold transition flex items-center space-x-1 ${
                      t.sortOrder !== undefined && t.sortOrder < 0
                        ? "bg-amber-400 text-[#0b2b20] shadow-sm"
                        : "bg-[#144534] text-slate-300 hover:text-amber-300 hover:bg-[#1d5943] border border-[#1d5943]"
                    }`}
                    title={t.sortOrder !== undefined && t.sortOrder < 0 ? "Default starting track (click to unset)" : "Set as default starting track"}
                  >
                    <Star className="w-3 h-3" />
                    <span>{t.sortOrder !== undefined && t.sortOrder < 0 ? "Default" : "Make Default"}</span>
                  </button>
                  <button
                    onClick={() => handleDeleteMusic(t.id)}
                    className="p-1 text-slate-400 hover:text-red-400"
                    title="Delete track"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL: Confirm Drawing */}
      {showDrawConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="festive-card max-w-md w-full p-6 rounded-2xl border-2 border-[#d4af37] shadow-2xl space-y-4">
            <div className="text-center space-y-2">
              <div className="text-4xl">🎅 ✨ 🎁</div>
              <h3 className="text-xl font-bold text-[#fef9ee] font-festive">
                Confirm Secret Santa Drawing
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                You are about to randomly draw Secret Santa assignments for <strong>{confirmedCount} participants</strong>.
                All configured exclusions will be strictly honored. Once drawn, assignments are final and notifications will be dispatched.
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-[#1d5943]">
              <button
                type="button"
                onClick={() => setShowDrawConfirm(false)}
                className="px-4 py-2 rounded-lg border border-[#1d5943] text-xs text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteDrawing}
                disabled={drawingLoading}
                className="px-6 py-2 rounded-lg bg-[#d4af37] hover:bg-[#f3c053] text-[#0b2b20] font-bold text-xs shadow flex items-center space-x-1.5"
              >
                {drawingLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{drawingLoading ? "Drawing Names..." : "Yes, Draw Names Now!"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Emergency Reset Drawing */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="festive-card max-w-md w-full p-6 rounded-2xl border-2 border-red-700 shadow-2xl space-y-4">
            <div className="text-center space-y-2">
              <AlertTriangle className="w-10 h-10 text-red-400 mx-auto" />
              <h3 className="text-xl font-bold text-red-200 font-festive">
                Reset Secret Santa Drawing?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Warning:</strong> Resetting will delete all current secret assignments and allow you to re-draw.
                Family members who have already seen their recipient may get assigned someone new.
              </p>
              <p className="text-xs text-amber-300 font-mono">
                Type <strong>CONFIRM_RESET_DRAWING</strong> below to proceed:
              </p>
            </div>

            <input
              type="text"
              value={resetConfirmCode}
              onChange={(e) => setResetConfirmCode(e.target.value)}
              placeholder="CONFIRM_RESET_DRAWING"
              className="w-full px-3 py-2 rounded-lg bg-[#0b2b20] border border-red-800 text-sm text-center text-slate-100 font-mono focus:outline-none"
            />

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowResetModal(false);
                  setResetConfirmCode("");
                }}
                className="px-4 py-2 rounded-lg border border-[#1d5943] text-xs text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetDrawing}
                disabled={resetConfirmCode !== "CONFIRM_RESET_DRAWING" || resetting}
                className="px-6 py-2 rounded-lg bg-red-700 hover:bg-red-600 text-white font-bold text-xs disabled:opacity-40"
              >
                {resetting ? "Resetting..." : "Confirm Reset"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Add Exclusion */}
      {showExclusionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="festive-card max-w-md w-full p-6 rounded-2xl border-2 border-[#d4af37]/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1d5943] pb-3">
              <h3 className="text-lg font-bold text-[#fef9ee] font-festive">Add Exclusion Rule</h3>
              <button
                onClick={() => setShowExclusionModal(false)}
                className="text-slate-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddExclusion} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="userASelect">
                  Participant 1
                </label>
                <select
                  id="userASelect"
                  required
                  value={userAId}
                  onChange={(e) => setUserAId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0b2b20] border border-[#1d5943] text-sm text-slate-100"
                >
                  <option value="">Select participant...</option>
                  {members
                    .filter((m) => {
                      const p = exchange?.participants?.find(
                        (part) => (part.user?.id || (part as unknown as { userId?: string }).userId) === m.id
                      );
                      return !p || p.status !== "DECLINED";
                    })
                    .map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.email})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="userBSelect">
                  Participant 2 (Cannot draw each other)
                </label>
                <select
                  id="userBSelect"
                  required
                  value={userBId}
                  onChange={(e) => setUserBId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0b2b20] border border-[#1d5943] text-sm text-slate-100"
                >
                  <option value="">Select participant...</option>
                  {members
                    .filter((m) => {
                      if (m.id === userAId) return false;
                      const p = exchange?.participants?.find(
                        (part) => (part.user?.id || (part as unknown as { userId?: string }).userId) === m.id
                      );
                      return !p || p.status !== "DECLINED";
                    })
                    .map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.email})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="exReasonInput">
                  Reason (Optional)
                </label>
                <input
                  id="exReasonInput"
                  type="text"
                  value={exclusionReason}
                  onChange={(e) => setExclusionReason(e.target.value)}
                  placeholder="Spouse / Partner / Lives together"
                  className="w-full px-3 py-2 rounded-lg bg-[#0b2b20] border border-[#1d5943] text-sm text-slate-100"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-[#1d5943]">
                <button
                  type="button"
                  onClick={() => setShowExclusionModal(false)}
                  className="px-4 py-2 rounded-lg border border-[#1d5943] text-xs text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingExclusion}
                  className="px-6 py-2 rounded-lg bg-[#d4af37] hover:bg-[#f3c053] text-[#0b2b20] font-bold text-xs"
                >
                  {addingExclusion ? "Saving..." : "Save Rule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Create New Exchange */}
      {showExchangeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="festive-card max-w-lg w-full p-6 rounded-2xl border-2 border-[#d4af37]/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1d5943] pb-3">
              <h3 className="text-lg font-bold text-[#fef9ee] font-festive">
                Create New Christmas Exchange
              </h3>
              <button
                onClick={() => setShowExchangeModal(false)}
                className="text-slate-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateExchange} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="exNameInput">
                  Exchange Name
                </label>
                <input
                  id="exNameInput"
                  type="text"
                  required
                  value={newExName}
                  onChange={(e) => setNewExName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0b2b20] border border-[#1d5943] text-sm text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="exYearInput">
                    Christmas Year
                  </label>
                  <input
                    id="exYearInput"
                    type="number"
                    required
                    value={newExYear}
                    onChange={(e) => setNewExYear(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0b2b20] border border-[#1d5943] text-sm text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="exBudgetInput">
                    Budget ($)
                  </label>
                  <input
                    id="exBudgetInput"
                    type="number"
                    step="0.01"
                    required
                    value={newExBudget}
                    onChange={(e) => setNewExBudget(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0b2b20] border border-[#1d5943] text-sm text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="exDateInput">
                  Exchange Date
                </label>
                <input
                  id="exDateInput"
                  type="date"
                  required
                  value={newExDate}
                  onChange={(e) => setNewExDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0b2b20] border border-[#1d5943] text-sm text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="exInstructionsInput">
                  Special Instructions
                </label>
                <textarea
                  id="exInstructionsInput"
                  rows={2}
                  value={newExInstructions}
                  onChange={(e) => setNewExInstructions(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0b2b20] border border-[#1d5943] text-sm text-slate-100 resize-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-[#1d5943]">
                <button
                  type="button"
                  onClick={() => setShowExchangeModal(false)}
                  className="px-4 py-2 rounded-lg border border-[#1d5943] text-xs text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingExchange}
                  className="px-6 py-2 rounded-lg bg-[#d4af37] hover:bg-[#f3c053] text-[#0b2b20] font-bold text-xs"
                >
                  {creatingExchange ? "Creating..." : "Create Exchange"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Upload Music */}
      {showMusicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="festive-card max-w-md w-full p-6 rounded-2xl border-2 border-[#d4af37]/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1d5943] pb-3">
              <h3 className="text-lg font-bold text-[#fef9ee] font-festive">Upload Holiday Music</h3>
              <button
                onClick={() => setShowMusicModal(false)}
                className="text-slate-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleUploadMusic} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="musicTitleInput">
                  Track Title *
                </label>
                <input
                  id="musicTitleInput"
                  type="text"
                  required
                  value={musicTitle}
                  onChange={(e) => setMusicTitle(e.target.value)}
                  placeholder="Joy to the World"
                  className="w-full px-3 py-2 rounded-lg bg-[#0b2b20] border border-[#1d5943] text-sm text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="musicArtistInput">
                  Artist / Orchestra (Optional)
                </label>
                <input
                  id="musicArtistInput"
                  type="text"
                  value={musicArtist}
                  onChange={(e) => setMusicArtist(e.target.value)}
                  placeholder="Family Choir"
                  className="w-full px-3 py-2 rounded-lg bg-[#0b2b20] border border-[#1d5943] text-sm text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="musicCategorySelect">
                  Category
                </label>
                <select
                  id="musicCategorySelect"
                  value={musicCategory}
                  onChange={(e) => setMusicCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0b2b20] border border-[#1d5943] text-sm text-slate-100"
                >
                  <option value="FESTIVE">Festive Christmas</option>
                  <option value="CLASSIC">Classic Carols</option>
                  <option value="INSTRUMENTAL">Instrumental Christmas</option>
                  <option value="PEACEFUL">Peaceful Winter</option>
                  <option value="CUSTOM">Custom Family Music</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="audioFileInput">
                  Audio File (.mp3, .ogg, .wav &bull; max 15MB) *
                </label>
                <input
                  id="audioFileInput"
                  type="file"
                  required
                  accept="audio/mpeg,audio/ogg,audio/wav"
                  onChange={(e) => setMusicFile(e.target.files?.[0] || null)}
                  className="w-full px-2 py-1 text-xs text-slate-300 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#144534] file:text-[#d4af37] hover:file:bg-[#1d5943]"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-center space-x-2 text-xs text-slate-200 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={musicIsDefault}
                    onChange={(e) => setMusicIsDefault(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#0b2b20] border-[#1d5943] text-[#d4af37] focus:ring-[#d4af37]"
                  />
                  <span className="flex items-center space-x-1 font-medium">
                    <Star className="w-3.5 h-3.5 text-amber-400" />
                    <span>Set as default track (plays first for all family members)</span>
                  </span>
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-[#1d5943]">
                <button
                  type="button"
                  onClick={() => setShowMusicModal(false)}
                  className="px-4 py-2 rounded-lg border border-[#1d5943] text-xs text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingMusic}
                  className="px-6 py-2 rounded-lg bg-[#d4af37] hover:bg-[#f3c053] text-[#0b2b20] font-bold text-xs"
                >
                  {uploadingMusic ? "Uploading..." : "Upload & Save Track"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Edit Exchange Settings */}
      {showEditExchangeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="festive-card max-w-lg w-full p-6 rounded-2xl border-2 border-[#d4af37]/50 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1d5943] pb-3">
              <h3 className="text-lg font-bold text-[#fef9ee] font-festive flex items-center space-x-2">
                <Edit3 className="w-5 h-5 text-[#d4af37]" />
                <span>Edit Exchange Settings</span>
              </h3>
              <button
                onClick={() => setShowEditExchangeModal(false)}
                className="text-slate-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveExchangeEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="editNameInput">
                  Exchange Name *
                </label>
                <input
                  id="editNameInput"
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0b2b20] border border-[#1d5943] text-sm text-slate-100 focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="editBudgetInput">
                    Gift Budget ($) *
                  </label>
                  <input
                    id="editBudgetInput"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={editBudget}
                    onChange={(e) => setEditBudget(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0b2b20] border border-[#1d5943] text-sm text-slate-100 focus:border-[#d4af37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="editDateInput">
                    Exchange Date *
                  </label>
                  <input
                    id="editDateInput"
                    type="date"
                    required
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0b2b20] border border-[#1d5943] text-sm text-slate-100 focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="editLocationInput">
                  Location (Optional)
                </label>
                <input
                  id="editLocationInput"
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  placeholder="Grandma's House / Living Room"
                  className="w-full px-3 py-2 rounded-lg bg-[#0b2b20] border border-[#1d5943] text-sm text-slate-100 focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="editInstructionsInput">
                  Special Instructions
                </label>
                <textarea
                  id="editInstructionsInput"
                  rows={3}
                  value={editInstructions}
                  onChange={(e) => setEditInstructions(e.target.value)}
                  placeholder="Wrap gifts nicely, label them with recipient's name..."
                  className="w-full px-3 py-2 rounded-lg bg-[#0b2b20] border border-[#1d5943] text-sm text-slate-100 focus:border-[#d4af37] focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-[#1d5943]">
                <button
                  type="button"
                  onClick={() => setShowEditExchangeModal(false)}
                  className="px-4 py-2 rounded-lg border border-[#1d5943] text-xs text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-6 py-2 rounded-lg bg-[#d4af37] hover:bg-[#f3c053] text-[#0b2b20] font-bold text-xs shadow flex items-center space-x-1.5"
                >
                  {savingEdit && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{savingEdit ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* In-App Embedded Stripe Checkout Modal */}
      {showCheckoutModal && checkoutClientSecret && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-[#0b2b20] border-2 border-[#d4af37] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#1d5943] pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-[#d4af37] text-[#0b2b20] flex items-center justify-center font-bold">
                  <Crown className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#fef9ee] font-festive">Host Pass Upgrade ($7.99)</h2>
                  <p className="text-xs text-[#f3c053]">One-time fee • Unlocks unlimited members & perks</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowCheckoutModal(false);
                  setCheckoutClientSecret(null);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#144534] transition"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div id="checkout" className="rounded-xl overflow-hidden bg-white/5 p-2 min-h-[400px]">
              <EmbeddedCheckoutProvider
                stripe={getStripe()}
                options={{ clientSecret: checkoutClientSecret }}
              >
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
