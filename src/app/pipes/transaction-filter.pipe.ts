import { Pipe, PipeTransform } from '@angular/core';
import { Transaction } from '../models';
import { TransactionType } from '../enums';

@Pipe({
  name: 'transactionFilter',
  standalone: true
})
export class TransactionFilterPipe implements PipeTransform {
  
  transform(
    transactions: Transaction[],
    filterType?: TransactionType | 'All',
    searchTerm?: string
  ): Transaction[] {
    if (!transactions) {
      return [];
    }

    let filteredTransactions = [...transactions];

    // Filter by transaction type
    if (filterType && filterType !== 'All') {
      filteredTransactions = filteredTransactions.filter(
        transaction => transaction.type === filterType
      );
    }

    // Filter by search term (description)
    if (searchTerm && searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase().trim();
      filteredTransactions = filteredTransactions.filter(
        transaction => transaction.description.toLowerCase().includes(term)
      );
    }

    return filteredTransactions;
  }
}
