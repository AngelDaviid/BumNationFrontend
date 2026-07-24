import { CreateMembershipData, GymMembership, MembershipPayment, MembershipWithStats, RenewMembershipData } from '@/types';
import { apiClient } from './client';

export const membershipApi = {
  getMyMembership: (token: string) =>
    apiClient<MembershipWithStats>('/gym-membership/me', { token }),

  getMyPayments: (token: string) =>
    apiClient<MembershipPayment[]>('/gym-membership/me/payments', { token }),

  getAll: (token: string) =>
    apiClient<MembershipWithStats[]>('/gym-membership', { token }),

  getByUserId: (userId: string, token: string) =>
    apiClient<MembershipWithStats>(`/gym-membership/${userId}`, { token }),

  create: (userId: string, data: CreateMembershipData, token: string) =>
    apiClient<GymMembership>(`/gym-membership/${userId}`, {
      method: 'POST',
      body: data,
      token,
    }),

  renew: (userId: string, data: RenewMembershipData, token: string) =>
    apiClient<GymMembership>(`/gym-membership/${userId}/renew`, {
      method: 'POST',
      body: data,
      token,
    }),

  updateStatus: (userId: string, status: string, token: string) =>
    apiClient<GymMembership>(`/gym-membership/${userId}/status`, {
      method: 'PATCH',
      body: { status },
      token,
    }),
};