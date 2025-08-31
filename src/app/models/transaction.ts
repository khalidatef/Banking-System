export interface Transaction {
    id: string;
    fromAccountNo: string;
    ToAccountNo: string;
    date: Date | string;
    amount: number;
    type: 'Debit' | 'Credit';
    description: string;
}
