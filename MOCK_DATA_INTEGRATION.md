# Mock Data Integration Guide

## Overview

This project now includes a comprehensive mock data system that provides realistic banking data for development and testing. The integration includes:

- **MockDataService**: A service that loads and manages mock data from JSON files
- **Enhanced AuthService**: Updated to work with the new mock data while maintaining backward compatibility
- **Real Data Integration**: Components now use actual data instead of hardcoded values

## File Structure

```
src/
├── assets/
│   └── mock-data/
│       ├── users.json        # User profiles and authentication data
│       ├── accounts.json     # Bank accounts linked to users
│       ├── transactions.json # Banking transactions history
│       └── branches.json     # Bank branch information
└── app/
    └── services/
        ├── mock-data.service.ts  # Main data management service
        └── auth.service.ts       # Updated authentication service
```

## Mock Data Contents

### Users (`users.json`)
- 6 comprehensive user profiles
- Includes personal info, addresses, roles, and status
- Authentication credentials for testing

### Accounts (`accounts.json`)
- Multiple account types per user (Savings, Current, Fixed Deposit)
- Realistic balances and account details
- Branch associations and account status

### Transactions (`transactions.json`)
- 20+ realistic banking transactions
- Various categories (Salary, Shopping, Utilities, etc.)
- Credit and debit operations with proper amounts

### Branches (`branches.json`)
- 5 bank branches across Egypt
- Complete addresses, contact info, and services
- Working hours and ATM counts

## Authentication Credentials

For testing purposes, use these credentials:

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | Admin |
| user1 | user123 | User |
| user2 | user123 | User |
| user3 | user123 | User |
| ahmed | ahmed123 | User |
| sara.mahmoud | sara123 | User |

## Using MockDataService

### Basic Usage

```typescript
import { MockDataService } from './services/mock-data.service';

constructor(private mockDataService: MockDataService) {}

// Get all users
this.mockDataService.getUsers().subscribe(users => {
  console.log('Users:', users);
});

// Get user transactions
this.mockDataService.getTransactionsByUserId('USR001').subscribe(transactions => {
  console.log('User transactions:', transactions);
});

// Get account statistics
this.mockDataService.getAccountStatistics('USR001').subscribe(stats => {
  console.log('Account stats:', stats);
});
```

### Available Methods

#### User Management
- `getUsers()` - Get all users
- `getUserById(id)` - Get user by ID
- `getUserByUsername(username)` - Get user by username
- `updateUser(user)` - Update user information
- `deleteUser(userId)` - Delete a user

#### Account Management
- `getAccounts()` - Get all accounts
- `getAccountsByUserId(userId)` - Get user's accounts
- `getAccountById(accountId)` - Get specific account
- `updateAccountBalance(accountId, balance)` - Update account balance

#### Transaction Management
- `getTransactions()` - Get all transactions
- `getTransactionsByUserId(userId)` - Get user's transactions
- `getTransactionsByAccountId(accountId)` - Get account transactions
- `addTransaction(transaction)` - Add new transaction
- `searchTransactions(userId, query)` - Search transactions

#### Statistics
- `getUserStatistics()` - Get user count statistics
- `getAccountStatistics(userId)` - Get account statistics for user
- `getTransactionStatistics(userId)` - Get transaction statistics

#### Authentication
- `authenticateUser(username, password)` - Authenticate user login

### Enhanced AuthService

The AuthService has been updated to work with MockDataService while maintaining backward compatibility:

```typescript
import { AuthService } from './services/auth.service';

// Login with mock data
this.authService.login('admin', 'admin123').subscribe(result => {
  if (result.success) {
    console.log('Login successful');
  }
});

// Get current user with full data
const currentUser = this.authService.getCurrentMockUser();
const userName = this.authService.getCurrentUserDisplayName();
const userId = this.authService.getCurrentUserId();
```

## Component Integration Example

Here's how the UserDashboardComponent was updated to use real data:

```typescript
export class UserDashboardComponent implements OnInit, OnDestroy {
  constructor(
    private mockDataService: MockDataService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getCurrentUserId();
    
    // Load real user data
    combineLatest([
      this.mockDataService.getAccountStatistics(userId),
      this.mockDataService.getTransactionsByUserId(userId)
    ]).subscribe(([accountStats, transactions]) => {
      this.updateAccountStats(accountStats);
      this.updateRecentTransactions(transactions);
    });
  }
}
```

## Data Formats

### User Object
```typescript
interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
  role: 'Admin' | 'User';
  status: 'Active' | 'Inactive';
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationalId: string;
  address: Address;
  createdAt: string;
  lastLogin: string;
  profileImage: string;
}
```

### Account Object
```typescript
interface Account {
  id: string;
  userId: string;
  accountNumber: string;
  accountType: string;
  accountName: string;
  balance: number;
  currency: string;
  status: string;
  openingDate: string;
  branch: Branch;
  isDefault: boolean;
}
```

### Transaction Object
```typescript
interface Transaction {
  id: string;
  accountId: string;
  userId: string;
  type: 'Credit' | 'Debit';
  amount: number;
  currency: string;
  description: string;
  category: string;
  status: string;
  date: string;
  transactionReference: string;
  balance: number;
  fees: number;
}
```

## Best Practices

1. **Error Handling**: Always include error handling when using the service
2. **Unsubscribe**: Use `takeUntil()` to prevent memory leaks
3. **Loading States**: Show loading indicators while data is being fetched
4. **Fallback Data**: Provide fallback data for when the service fails
5. **Type Safety**: Use the provided interfaces for type safety

## Troubleshooting

### Common Issues

1. **Data not loading**: Check browser console for HTTP errors
2. **Authentication failing**: Verify credentials and JSON file location
3. **Missing data**: Ensure all JSON files are in `src/assets/mock-data/`
4. **Type errors**: Import interfaces from `MockDataService`

### Debug Tips

```typescript
// Check if data is loaded
console.log('Users loaded:', this.mockDataService.getUsers());

// Verify current user
console.log('Current user:', this.authService.getCurrentMockUser());

// Check authentication state
console.log('Is logged in:', this.authService.isLoggedIn());
```

## Future Enhancements

- Add data validation and error handling
- Implement data persistence (localStorage/sessionStorage)
- Add data modification methods (update, delete)
- Create data seeding utilities
- Add real-time data updates simulation
- Implement data filtering and pagination

## Migration Guide

To update existing components to use mock data:

1. Import `MockDataService` and `AuthService`
2. Replace hardcoded data with service calls
3. Add proper error handling and loading states
4. Use Observable patterns with `takeUntil()` for cleanup
5. Test with different user accounts and data scenarios

This mock data system provides a solid foundation for developing and testing banking features with realistic data while maintaining the flexibility to easily switch to real APIs in production.
