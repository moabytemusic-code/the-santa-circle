import crypto from "crypto";
import { prisma } from "@/lib/db";
import { ExchangeStatus, ParticipantStatus } from "@prisma/client";

export interface ParticipantInfo {
  id: string;
  name: string;
  email: string;
}

export interface ExclusionPair {
  userAId: string;
  userBId: string;
  bidirectional?: boolean;
}

export interface AssignmentResult {
  giverId: string;
  recipientId: string;
}

export interface DrawingEngineResult {
  success: boolean;
  assignments?: AssignmentResult[];
  error?: string;
  conflictingParticipants?: string[];
}

/**
 * Fisher-Yates cryptographic shuffle
 */
function secureShuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = crypto.randomInt(0, i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Pure Secret Santa matching algorithm.
 * Uses randomized backtracking with Minimum Remaining Values (MRV) heuristic.
 * Guaranteed to respect all exclusions, prevent self-draw, ensure 1:1 bijection,
 * and detect impossible rule configurations.
 */
export function generateSecretSantaAssignments(
  participants: ParticipantInfo[],
  exclusions: ExclusionPair[]
): DrawingEngineResult {
  if (participants.length < 3) {
    return {
      success: false,
      error: `At least 3 participants are required for a Secret Santa drawing. Currently confirmed: ${participants.length}.`,
    };
  }

  const participantIds = participants.map((p) => p.id);
  const participantMap = new Map(participants.map((p) => [p.id, p]));

  // Build exclusion graph
  // giverId -> Set of prohibited recipientIds
  const prohibited = new Map<string, Set<string>>();
  for (const id of participantIds) {
    const set = new Set<string>();
    set.add(id); // Rule 3: Nobody may draw themselves
    prohibited.set(id, set);
  }

  for (const rule of exclusions) {
    if (prohibited.has(rule.userAId)) {
      prohibited.get(rule.userAId)!.add(rule.userBId);
    }
    // If bidirectional or default spouse exclusion
    if (rule.bidirectional !== false && prohibited.has(rule.userBId)) {
      prohibited.get(rule.userBId)!.add(rule.userAId);
    }
  }

  // Pre-check: Ensure every participant has at least 1 valid candidate
  for (const giverId of participantIds) {
    const excludedCount = prohibited.get(giverId)!.size;
    const remainingCount = participantIds.length - excludedCount;
    if (remainingCount <= 0) {
      const giver = participantMap.get(giverId);
      return {
        success: false,
        error: `Impossible configuration: "${giver?.name || giverId}" has no eligible recipients because of exclusion rules. Please remove or adjust exclusion rules.`,
        conflictingParticipants: [giverId],
      };
    }
  }

  // Check incoming candidates: Ensure every participant can be gifted by at least 1 person
  for (const recipientId of participantIds) {
    let eligibleGivers = 0;
    for (const giverId of participantIds) {
      if (!prohibited.get(giverId)!.has(recipientId)) {
        eligibleGivers++;
      }
    }
    if (eligibleGivers === 0) {
      const recipient = participantMap.get(recipientId);
      return {
        success: false,
        error: `Impossible configuration: Nobody is allowed to give a gift to "${recipient?.name || recipientId}" due to exclusion rules.`,
        conflictingParticipants: [recipientId],
      };
    }
  }

  // Randomized Backtracking with MRV heuristic
  // Maximum attempts across multiple randomized seeds before declaring impossible
  const MAX_RESTARTS = 50;

  for (let attempt = 0; attempt < MAX_RESTARTS; attempt++) {
    const assignedRecipients = new Set<string>();
    const currentAssignments = new Map<string, string>(); // giverId -> recipientId

    function backtrack(): boolean {
      if (currentAssignments.size === participantIds.length) {
        return true; // All givers assigned
      }

      // MRV Heuristic: Pick unassigned giver with fewest valid available recipients
      let bestGiverId: string | null = null;
      let minOptions = Infinity;
      let bestCandidates: string[] = [];

      for (const giverId of participantIds) {
        if (currentAssignments.has(giverId)) continue;

        const candidateOptions: string[] = [];
        const prohibitedSet = prohibited.get(giverId)!;

        for (const candId of participantIds) {
          if (!assignedRecipients.has(candId) && !prohibitedSet.has(candId)) {
            candidateOptions.push(candId);
          }
        }

        if (candidateOptions.length === 0) {
          return false; // Dead end, must backtrack
        }

        if (candidateOptions.length < minOptions) {
          minOptions = candidateOptions.length;
          bestGiverId = giverId;
          bestCandidates = candidateOptions;
        }
      }

      if (!bestGiverId) return false;

      // Randomize candidate ordering for fair, unpredictable assignments
      const randomizedCandidates = secureShuffle(bestCandidates);

      for (const recipientId of randomizedCandidates) {
        currentAssignments.set(bestGiverId, recipientId);
        assignedRecipients.add(recipientId);

        if (backtrack()) {
          return true;
        }

        // Backtrack
        currentAssignments.delete(bestGiverId);
        assignedRecipients.delete(recipientId);
      }

      return false;
    }

    if (backtrack()) {
      const finalAssignments: AssignmentResult[] = [];
      for (const [giverId, recipientId] of currentAssignments.entries()) {
        finalAssignments.push({ giverId, recipientId });
      }
      return {
        success: true,
        assignments: finalAssignments,
      };
    }
  }

  return {
    success: false,
    error: "No valid Secret Santa assignment could be found that satisfies all exclusion rules. Please reduce exclusions and try again.",
  };
}

/**
 * Execute the Secret Santa drawing for an exchange within an atomic database transaction.
 * Prevents race conditions, enforces single-drawing finality, and logs an audit event.
 */
export async function executeExchangeDrawing(
  exchangeId: string,
  executedByUserId: string
): Promise<{ success: boolean; error?: string; count?: number }> {
  try {
    return await prisma.$transaction(async (tx) => {
      // 1. Fetch exchange with status check
      const exchange = await tx.giftExchange.findUnique({
        where: { id: exchangeId },
        include: {
          familyGroup: {
            include: {
              memberships: {
                where: { userId: executedByUserId },
              },
            },
          },
        },
      });

      if (!exchange) {
        return { success: false, error: "Gift exchange not found." };
      }

      // Authorization check: Only group admin or exchange creator can trigger drawing
      const membership = exchange.familyGroup.memberships[0];
      const isCreator = exchange.createdById === executedByUserId;
      const isAdmin = membership && membership.role === "ADMIN";

      if (!isCreator && !isAdmin) {
        return { success: false, error: "Only an authorized administrator can start the drawing." };
      }

      // Check if already drawn
      if (exchange.status === ExchangeStatus.DRAWN || exchange.status === ExchangeStatus.COMPLETED) {
        return {
          success: false,
          error: "This exchange has already been drawn. Ordinary redraws are prohibited to preserve assignment privacy.",
        };
      }

      // 2. Fetch confirmed participants
      const participants = await tx.exchangeParticipant.findMany({
        where: {
          exchangeId,
          status: ParticipantStatus.CONFIRMED,
        },
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      if (participants.length < 3) {
        return {
          success: false,
          error: `At least 3 confirmed participants are needed to draw names. Currently confirmed: ${participants.length}.`,
        };
      }

      // 3. Fetch exclusions
      const exclusionRecords = await tx.exclusionRule.findMany({
        where: { exchangeId },
      });

      const participantInfos: ParticipantInfo[] = participants.map((p) => ({
        id: p.user.id,
        name: p.user.name,
        email: p.user.email,
      }));

      const exclusionPairs: ExclusionPair[] = exclusionRecords.map((e) => ({
        userAId: e.userAId,
        userBId: e.userBId,
        bidirectional: true,
      }));

      // 4. Run drawing engine
      const drawingResult = generateSecretSantaAssignments(participantInfos, exclusionPairs);
      if (!drawingResult.success || !drawingResult.assignments) {
        return {
          success: false,
          error: drawingResult.error || "Failed to generate valid Secret Santa assignments.",
        };
      }

      // 5. Atomic persistence: Insert assignments
      await tx.giftAssignment.createMany({
        data: drawingResult.assignments.map((a) => ({
          exchangeId,
          giverId: a.giverId,
          recipientId: a.recipientId,
          drawnAt: new Date(),
        })),
      });

      // 6. Update exchange status to DRAWN
      await tx.giftExchange.update({
        where: { id: exchangeId },
        data: {
          status: ExchangeStatus.DRAWN,
          drawnAt: new Date(),
        },
      });

      // 7. Audit log
      await tx.auditEvent.create({
        data: {
          userId: executedByUserId,
          action: "EXCHANGE_DRAWN",
          entityType: "GiftExchange",
          entityId: exchangeId,
          details: JSON.stringify({
            participantCount: participants.length,
            exclusionsCount: exclusionRecords.length,
          }),
        },
      });

      // 8. Queue notifications for all participants
      await tx.exchangeNotification.createMany({
        data: participants.map((p) => ({
          exchangeId,
          userId: p.user.id,
          type: "DRAWING_READY",
          status: "PENDING",
        })),
      });

      return {
        success: true,
        count: drawingResult.assignments.length,
      };
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[Drawing Engine] Error drawing exchange ${exchangeId}:`, msg);
    return { success: false, error: msg };
  }
}

/**
 * Exceptional reset of drawing (Emergency Admin override with strict confirmation and audit).
 */
export async function resetExchangeDrawing(
  exchangeId: string,
  adminUserId: string,
  confirmationText: string
): Promise<{ success: boolean; error?: string }> {
  if (confirmationText !== "CONFIRM_RESET_DRAWING") {
    return {
      success: false,
      error: "Explicit confirmation code is required to reset a drawing.",
    };
  }

  try {
    return await prisma.$transaction(async (tx) => {
      const exchange = await tx.giftExchange.findUnique({
        where: { id: exchangeId },
        include: {
          familyGroup: {
            include: {
              memberships: {
                where: { userId: adminUserId },
              },
            },
          },
        },
      });

      if (!exchange) {
        return { success: false, error: "Exchange not found." };
      }

      const membership = exchange.familyGroup.memberships[0];
      const isAdmin = membership && membership.role === "ADMIN";
      const isCreator = exchange.createdById === adminUserId;

      if (!isAdmin && !isCreator) {
        return { success: false, error: "Unauthorized. Only administrators can reset an exchange." };
      }

      // Delete existing assignments
      await tx.giftAssignment.deleteMany({
        where: { exchangeId },
      });

      // Revert status to READY_TO_DRAW
      await tx.giftExchange.update({
        where: { id: exchangeId },
        data: {
          status: ExchangeStatus.READY_TO_DRAW,
          drawnAt: null,
        },
      });

      // Audit event
      await tx.auditEvent.create({
        data: {
          userId: adminUserId,
          action: "EXCHANGE_DRAWING_RESET",
          entityType: "GiftExchange",
          entityId: exchangeId,
          details: JSON.stringify({ reason: "Administrator manual reset with confirmation" }),
        },
      });

      return { success: true };
    });
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}
