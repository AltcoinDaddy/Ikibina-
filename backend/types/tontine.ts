// types/TontineTypes.ts
export interface Member {
  memberAddress: string;
  name: string;
  hasReceivedPot: boolean;
  hasContributedThisRound: boolean;
  totalContributed: bigint;
  exists: boolean;
}

export interface Group {
  name: string;
  description: string;
  contributionAmount: bigint;
  roundDuration: bigint;
  currentRound: bigint;
  members: string[];
  active: boolean;
}

export interface GroupCreatedEvent {
  groupId: bigint;
  name: string;
  creator: string;
}

export interface MemberJoinedEvent {
  groupId: bigint;
  member: string;
}

export interface ContributionMadeEvent {
  groupId: bigint;
  member: string;
  amount: bigint;
}
