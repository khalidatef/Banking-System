import { TransactionType } from '../enums';

export interface Transaction {
  id: number;
  fromAccountNo: string;
  ToAccountNo: string;
  date: Date;
  amount: number;
  type: TransactionType;
  description: string;
}
