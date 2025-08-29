import { Pipe, PipeTransform } from '@angular/core';
import { Transaction } from '../models/transaction';

@Pipe({
  name: 'transactionFilter',
  standalone: true
})
export class TransactionFilterPipe implements PipeTransform {
  transform(
    transactions: Transaction[],
    typeFilter: string,
    search: string
  ): Transaction[] {
    let filtered = transactions;

    if (typeFilter && typeFilter !== 'All') {
      filtered = filtered.filter(t => t.type === typeFilter);
    }

    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter(t =>
        t.description.toLowerCase().includes(term)
      );
    }

    return filtered;
  }
}
