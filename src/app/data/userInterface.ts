import { Role } from './mock-users';
export interface Iuser {
  username: string;
  password: string;
  role: Role;
  isActive: boolean;
  email: string;
  phone: string;
  id: string;
}

