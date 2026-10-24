import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { Gift, Calendar, DollarSign, Users, Sparkles, CheckCircle2, XCircle, Heart, ArrowRight } from "lucide-react";
import { ParticipationButtons } from "./ParticipationButtons";
import { FamilyDirectory } from "./FamilyDirectory";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  // Fetch user's family groups
  const memberships = await prisma.familyMembership.findMany({
    where: { userId: session.id },
    include: {
      familyGroup: {
        include: {
          exchanges: {
            orderBy: { year: "desc" },
            include: {
              participants: {
                include: {
                  user: { select: { id: true, name: true, email: true, avatarUrl: true } },
                },
              },
            },
          },
          memberships: {
            include: {
              user: { select: { id: true, name: true, email: true, role: true } },
            },
          },
        },
      },
    },
  });

  const primaryGroup = memberships[0]?.familyGroup;
  const currentExchange = primaryGroup?.exchanges[0];

  const currentParticipant = currentExchange?.participants.find(
    (p) => p.userId === session.id
  );

  // Check if current user has an assignment drawn
  let assignmentExists = false;
  let hasRevealed = false;
  if (currentExchange && currentExchange.status === "DRAWN") {
    const assignment = await prisma.giftAssignment.findUnique({
      where: {
        exchangeId_giverId: {
          exchangeId: currentExchange.id,
          giverId: session.id,
        },
      },
    });
    if (assignment) {
      assignmentExists = true;
      hasRevealed = !!assignment.revealedAt;
    }
  }

  return (
    <div className="space-y-8 py-4 sm:py-6 max-w-6xl mx-auto">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#1d5943] pb-6">
        <div>
          <div className="text-sm font-semibold text-[#f3c053] tracking-wide uppercase">
            {primaryGroup?.name || "Our Gift Circle"}
          </div>
          <h1 className="text-3xl font-bold text-[#fef9ee] font-festive">
            Welcome, {session.name}! 🎅
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/wishlist"
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#144534] hover:bg-[#1d5943] border border-[#d4af37]/40 text-[#f3c053] text-sm font-medium transition"
          >
            <Heart className="w-4 h-4 text-[#d4af37]" />
            <span>My Wish List</span>
          </Link>

          {session.role === "ADMIN" && (
            <Link
              href="/admin"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#d4af37] hover:bg-[#f3c053] text-[#0b2b20] text-sm font-bold transition shadow"
            >
              <span>Host Controls</span>
            </Link>
          )}
        </div>
      </div>

      {/* Main Exchange Highlight Card */}
      {currentExchange ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Exchange Info */}
          <div className="lg:col-span-2 festive-card p-6 sm:p-8 rounded-2xl space-y-6">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-[#0b2b20] text-[#d4af37] border border-[#d4af37]/30">
                {currentExchange.status === "DRAWN" ? "Drawing Complete" : "Upcoming Exchange"}
              </span>
              <span className="text-sm text-slate-300 font-medium">Christmas {currentExchange.year}</span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#fef9ee] font-festive">
                {currentExchange.name}
              </h2>
              {currentExchange.instructions && (
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                  {currentExchange.instructions}
                </p>
              )}
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-3 rounded-xl bg-[#0b2b20]/70 border border-[#1d5943]">
                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <DollarSign className="w-4 h-4 text-[#d4af37]" />
                  <span>Gift Budget</span>
                </div>
                <div className="text-lg font-bold text-[#fef9ee] mt-1">
                  ${Number(currentExchange.budget).toFixed(2)} {currentExchange.currency}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#0b2b20]/70 border border-[#1d5943]">
                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <Calendar className="w-4 h-4 text-[#d4af37]" />
                  <span>Exchange Date</span>
                </div>
                <div className="text-lg font-bold text-[#fef9ee] mt-1">
                  {new Date(currentExchange.exchangeDate).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#0b2b20]/70 border border-[#1d5943] col-span-2 sm:col-span-1">
                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <Users className="w-4 h-4 text-[#d4af37]" />
                  <span>Participants</span>
                </div>
                <div className="text-lg font-bold text-[#fef9ee] mt-1">
                  {currentExchange.participants.filter((p) => p.status === "CONFIRMED").length} Confirmed
                </div>
              </div>
            </div>

            {/* Participation Status & Toggles */}
            <div className="p-4 rounded-xl bg-[#144534] border border-[#d4af37]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="text-xs text-slate-300">Your Participation Status:</div>
                <div className="text-sm font-bold flex items-center space-x-1.5">
                  {currentParticipant?.status === "CONFIRMED" ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-300">You are confirmed to participate!</span>
                    </>
                  ) : currentParticipant?.status === "DECLINED" ? (
                    <>
                      <XCircle className="w-4 h-4 text-red-400" />
                      <span className="text-red-300">You declined this exchange</span>
                    </>
                  ) : (
                    <span className="text-[#f3c053]">Invited - Please confirm your spot</span>
                  )}
                </div>
              </div>

              {currentExchange.status !== "DRAWN" && currentExchange.status !== "COMPLETED" && (
                <ParticipationButtons
                  exchangeId={currentExchange.id}
                  currentStatus={currentParticipant?.status || "INVITED"}
                />
              )}
            </div>
          </div>

          {/* Secret Santa Assignment Card (Right Column) */}
          <div className="festive-card p-6 sm:p-8 rounded-2xl flex flex-col justify-between border-2 border-[#d4af37]/40 bg-gradient-to-b from-[#144534] to-[#0b2b20]">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#0b2b20] border border-[#d4af37] flex items-center justify-center text-[#d4af37] text-2xl shadow-inner">
                🎁
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#fef9ee] font-festive">
                  Your Secret Assignment
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {currentExchange.status === "DRAWN"
                    ? assignmentExists
                      ? hasRevealed
                        ? "You have revealed your recipient. You can review their details and wish list anytime."
                        : "Names have been drawn! Your recipient is waiting to be unveiled."
                      : "You are not participating as a giver in this exchange."
                    : "The drawing has not taken place yet. Once the organizer draws names, your recipient will appear here!"}
                </p>
              </div>
            </div>

            <div className="pt-6">
              {currentExchange.status === "DRAWN" && assignmentExists ? (
                <Link
                  href="/reveal"
                  className="w-full py-3.5 px-4 rounded-xl bg-[#d4af37] hover:bg-[#f3c053] text-[#0b2b20] font-bold text-sm transition shadow-lg flex items-center justify-center space-x-2 animate-unwrap"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{hasRevealed ? "View Your Recipient" : "✨ Unwrap Your Recipient ✨"}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              ) : (
                <div className="text-center py-3 px-4 rounded-xl bg-[#0b2b20]/60 border border-[#1d5943] text-xs text-slate-400">
                  {currentExchange.status === "DRAWN"
                    ? "No assignment for this exchange"
                    : "⏳ Drawing Pending"}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="festive-card p-8 rounded-2xl text-center space-y-4">
          <div className="text-4xl">🎄</div>
          <h2 className="text-xl font-bold text-[#fef9ee] font-festive">No Active Christmas Exchange Yet</h2>
          <p className="text-sm text-slate-300 max-w-md mx-auto">
            Your family group does not have an active exchange scheduled.
            An administrator can create one from the Admin Panel.
          </p>
          {session.role === "ADMIN" && (
            <Link
              href="/admin"
              className="inline-block px-6 py-2.5 rounded-full bg-[#d4af37] text-[#0b2b20] font-bold text-sm"
            >
              Create New Exchange
            </Link>
          )}
        </div>
      )}

      {/* Family & Confirmed Participants Directory */}
      {primaryGroup && (
        <FamilyDirectory
          memberships={primaryGroup.memberships.map((m) => ({
            role: m.role,
            user: {
              id: m.user.id,
              name: m.user.name,
              email: m.user.email,
              role: m.user.role,
            },
          }))}
          participants={
            currentExchange?.participants.map((p) => ({
              userId: p.userId,
              status: p.status,
            })) || []
          }
          hasExchange={!!currentExchange}
          isAdmin={session.role === "ADMIN"}
          currentUserId={session.id}
        />
      )}
    </div>
  );
}
