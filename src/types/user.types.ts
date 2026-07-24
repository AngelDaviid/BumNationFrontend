export type Role = 'CLIENT' | 'ADMIN';

export interface User {
  id: string;
  identification: string;
  firstName: string;
  middleName?: string;
  firstLastName: string;
  secondLastName?: string;
  email: string;
  phone: string;
  imageUrl: string | null;
  role: Role;
  createdAt: string;
  updatedAt: string;
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

/**
export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
} **/