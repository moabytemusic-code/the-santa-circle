import { describe, it, expect } from "vitest";
import {
  generateSecretSantaAssignments,
  ParticipantInfo,
  ExclusionPair,
} from "@/lib/engine/drawing";

describe("Secret Santa Drawing Engine", () => {
  const sampleParticipants: ParticipantInfo[] = [
    { id: "user-1", name: "Alice", email: "alice@family.com" },
    { id: "user-2", name: "Bob", email: "bob@family.com" },
    { id: "user-3", name: "Charlie", email: "charlie@family.com" },
    { id: "user-4", name: "Diana", email: "diana@family.com" },
    { id: "user-5", name: "Edward", email: "edward@family.com" },
  ];

  it("should reject drawing when fewer than 3 participants are provided", () => {
    const twoPeople = sampleParticipants.slice(0, 2);
    const result = generateSecretSantaAssignments(twoPeople, []);
    expect(result.success).toBe(false);
    expect(result.error).toContain("At least 3 participants are required");
  });

  it("should generate a valid drawing where nobody draws themselves and all participants receive and give exactly once", () => {
    const result = generateSecretSantaAssignments(sampleParticipants, []);
    expect(result.success).toBe(true);
    expect(result.assignments).toBeDefined();

    const assignments = result.assignments!;
    expect(assignments.length).toBe(sampleParticipants.length);

    const givers = new Set<string>();
    const recipients = new Set<string>();

    for (const a of assignments) {
      // 1. Giver != Recipient
      expect(a.giverId).not.toBe(a.recipientId);

      // 2. Each giver appears once
      expect(givers.has(a.giverId)).toBe(false);
      givers.add(a.giverId);

      // 3. Each recipient appears once
      expect(recipients.has(a.recipientId)).toBe(false);
      recipients.add(a.recipientId);
    }

    expect(givers.size).toBe(sampleParticipants.length);
    expect(recipients.size).toBe(sampleParticipants.length);
  });

  it("should respect spouse / mutual exclusions", () => {
    // Alice (user-1) and Bob (user-2) are married and cannot draw each other
    // Charlie (user-3) and Diana (user-4) are partners and cannot draw each other
    const exclusions: ExclusionPair[] = [
      { userAId: "user-1", userBId: "user-2" },
      { userAId: "user-3", userBId: "user-4" },
    ];

    // Run 20 iterations to ensure exclusions hold consistently across random drawings
    for (let i = 0; i < 20; i++) {
      const result = generateSecretSantaAssignments(sampleParticipants, exclusions);
      expect(result.success).toBe(true);

      const assignments = result.assignments!;
      for (const a of assignments) {
        // Nobody draws themselves
        expect(a.giverId).not.toBe(a.recipientId);

        // Alice cannot draw Bob
        if (a.giverId === "user-1") {
          expect(a.recipientId).not.toBe("user-2");
        }
        // Bob cannot draw Alice
        if (a.giverId === "user-2") {
          expect(a.recipientId).not.toBe("user-1");
        }
        // Charlie cannot draw Diana
        if (a.giverId === "user-3") {
          expect(a.recipientId).not.toBe("user-4");
        }
        // Diana cannot draw Charlie
        if (a.giverId === "user-4") {
          expect(a.recipientId).not.toBe("user-3");
        }
      }
    }
  });

  it("should detect impossible configurations and return clear error explanation", () => {
    // 3 participants: Alice, Bob, Charlie.
    // If Alice cannot draw Bob, and Alice cannot draw Charlie, Alice has 0 valid recipients.
    const threePeople = sampleParticipants.slice(0, 3);
    const impossibleExclusions: ExclusionPair[] = [
      { userAId: "user-1", userBId: "user-2", bidirectional: false },
      { userAId: "user-1", userBId: "user-3", bidirectional: false },
    ];

    const result = generateSecretSantaAssignments(threePeople, impossibleExclusions);
    expect(result.success).toBe(false);
    expect(result.error).toContain("Impossible configuration");
    expect(result.error).toContain("Alice");
  });

  it("should detect deadlock when everyone is mutually excluded leaving no valid cycle", () => {
    // 3 participants: Alice, Bob, Charlie.
    // Alice and Bob exclude each other. Bob and Charlie exclude each other.
    // Charlie is the only one who can draw anyone, but someone must draw Charlie.
    const threePeople = sampleParticipants.slice(0, 3);
    const deadlockExclusions: ExclusionPair[] = [
      { userAId: "user-1", userBId: "user-2" },
      { userAId: "user-2", userBId: "user-3" },
      { userAId: "user-1", userBId: "user-3" },
    ];

    const result = generateSecretSantaAssignments(threePeople, deadlockExclusions);
    expect(result.success).toBe(false);
  });
});
