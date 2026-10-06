import { CreateMembershipData, GymMembership, MembershipPayment, MembershipStatus, MembershipWithStats, RenewMembershipData } from '@/types';
import { apiClient } from './client';

export const membershipApi = {
  getMyMembership: () =>
    apiClient<MembershipWithStats>('/gym-membership/me'),

  getMyPayments: () =>
    apiClient<MembershipPayment[]>('/gym-membership/me/payments'),

  getAll: () =>
    apiClient<MembershipWithStats[]>('/gym-membership'),

  getByUserId: (userId: string) =>
    apiClient<MembershipWithStats>(`/gym-membership/${userId}`),

  create: (userId: string, data: CreateMembershipData) =>
    apiClient<GymMembership>(`/gym-membership/${userId}`, {
      method: 'POST',
      body: data,
    }),

  renew: (userId: string, data: RenewMembershipData) =>
    apiClient<GymMembership>(`/gym-membership/${userId}/renew`, {
      method: 'POST',
      body: data,
    }),

  updateStatus: (userId: string, status: MembershipStatus) =>
    apiClient<GymMembership>(`/gym-membership/${userId}/status`, {
      method: 'PATCH',
      body: { status },
    }),
};