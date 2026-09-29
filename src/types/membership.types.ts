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
  expiredAt: string | null;
  createdAt: string;
  updatedAt: string;
  membershipPayments?: MembershipPayment[];
  user?: {
    firstName: string;
    firstLastName: string;
    email: string;
    phone: string | null;
  };
}

export interface MembershipStats {
  daysAsMember: number;
  daysUntilExpire: number;
  daysSinceExpired: number;
  isAboutExpire: boolean;
  isExpired: boolean;
}

export type MembershipWithStats = GymMembership & MembershipStats;

export interface CreateMembershipData {
  startDate: string;
  initialPayment: {
    amount: number;
    notes?: string;
  };
}

export interface RenewMembershipData {
  amount: number;
  notes?: string;
}
