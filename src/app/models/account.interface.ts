import { AccountType } from '../enums';

export interface Account {
  id: number;
  accountNo: string;
  accountType: AccountType;
  balance: number;
  userId: number;
}
