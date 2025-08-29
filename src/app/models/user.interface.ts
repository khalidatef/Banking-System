import { UserRole } from '../enums';

export interface User {
  id: number;
  userName: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  email: string;
  phone: string;
}
