import { IUser } from '../models/iuser.model';

export const MOCK_USERS: IUser[] = [
  {
    id: 1,
    userName: 'admin',
    password: 'admin123',
    role: 'Admin',
    isActive: true,
    email: 'admin@securebank.io',
    phone: '01000000000'
   {
    id: 2,
    userName: 'esraa',
    password: 'esraa1',
    role: 'User',
    isActive: true,
    email: 'esraa@mail.com',
    phone: '01222222222'
  }
];
