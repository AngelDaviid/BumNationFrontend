export type MembershipStatus = 'ACTIVE' | 'EXPIRED' | 'SUSPENDED' | 'CANCELLED';

export interface MembershipPayment {
  id: string;
  membershipId: string;
  amount: string;
  paidAt: string;
  notes: string | null;
  validFrom: string;
  validUntil: string;
}

export interface GymMembership {
  id: string;
  userId: string;
  startDate: string;
  nextPaymentDate: string;
  status: MembershipStatus;
  createdAt: string;
  updatedAt: string;
  payments: MembershipPayment[];
}

export interface MembershipWithStats extends GymMembership {
  daysAsMember: number;
  daysUntilExpire: number;
  isAboutToExpire: boolean;
  isExpired: boolean;
}

export interface CreateMembershipData {
  startDate: string;
  nextPaymentDate: string;
}

export interface RenewMembershipData {
  amount: number;
  validFrom: string;
  validUntil: string;
  notes?: string;
}