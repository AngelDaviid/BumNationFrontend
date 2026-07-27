import { UpdateUserFormValues } from "@/common/schemas/user.schema";
import { GymMembership, MembershipWithStats } from "./membership.types";

export type Role = 'CLIENT' | 'ADMIN';

export interface User {
  id: string;
  identification: string;
  firstName: string;
  middleName?: string;
  firstLastName: string;
  secondLastName?: string;
  email: string;
  phone: string | null;
  imageUrl: string | null;
  role: Role;
  createdAt: string;
  updatedAt: string;
  gymMembership: GymMembership | null;
  membershipStats: MembershipWithStats | null
}

export interface RegisterData {
  identification: string;
  firstName: string;
  middleName?: string;
  firstLastName: string;
  secondLastName?: string;
  email: string;
  phone: string;
  password: string;
}

export interface UpdateUserData {
  firstName?: string;
  middleName?: string;
  firstLastName?: string;
  secondLastName?: string;
  phone?: string;
}


export type UpdateUserDataAdmin = UpdateUserFormValues;

/**
export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
} **/