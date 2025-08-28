# Contributing to Bank Masr Banking System

Thank you for contributing to our graduation project! This document provides guidelines for team collaboration and development practices.

## 🚀 Getting Started

### 1. Development Environment Setup

```bash
# Clone the repository
git clone <repository-url>
cd Banking-System-main

# Install dependencies
npm install

# Install git hooks
npm run prepare

# Start development server
npm start
```

### 2. Required Tools

- **Node.js**: v18+
- **npm**: v9+
- **Git**: Latest version
- **IDE**: VS Code (recommended) with extensions:
  - Angular Language Service
  - ESLint
  - Prettier
  - GitLens

## 🌿 Branch Workflow

### Branch Naming Convention

- `main` - Production-ready code (protected)
- `develop` - Integration branch (protected)
- `feature/[feature-name]` - New features
- `bugfix/[bug-description]` - Bug fixes
- `hotfix/[critical-fix]` - Critical production fixes
- `docs/[documentation-update]` - Documentation updates

### Example Branch Names

```
feature/user-authentication
feature/account-dashboard
bugfix/login-validation-error
hotfix/security-vulnerability
docs/api-documentation-update
```

## 💻 Development Process

### 1. Starting New Work

```bash
# Switch to develop branch
git checkout develop

# Pull latest changes
git pull origin develop

# Create feature branch
git checkout -b feature/your-feature-name

# Start coding...
```

### 2. Making Changes

- Write clean, readable code
- Follow TypeScript and Angular best practices
- Add unit tests for new features
- Update documentation if needed
- Ensure your changes don't break existing functionality

### 3. Before Committing

```bash
# Run linting
npm run lint

# Fix any linting issues
npm run lint:fix

# Format code
npm run format

# Run tests
npm test

# Type checking
npm run type-check
```

### 4. Committing Changes

We use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format: type(scope): description
git commit -m "feat(auth): add user login functionality"
git commit -m "fix(accounts): resolve balance calculation error"
git commit -m "docs(readme): update installation instructions"
git commit -m "style(header): improve responsive design"
```

#### Commit Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (no logic changes)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### 5. Creating Pull Requests

1. Push your branch to origin:
   ```bash
   git push origin feature/your-feature-name
   ```

2. Create PR from your branch to `develop`

3. Use this PR template:
   ```markdown
   ## Description
   Brief description of changes made.

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing
   - [ ] Unit tests pass
   - [ ] Manual testing completed
   - [ ] No console errors

   ## Checklist
   - [ ] Code follows project style guidelines
   - [ ] Self-review completed
   - [ ] Documentation updated if needed
   - [ ] No merge conflicts
   ```

4. Request review from at least 2 team members

5. Address all feedback before merging

## 🧪 Testing Guidelines

### Unit Tests

- Write tests for all new functions and components
- Maintain minimum 80% code coverage
- Use descriptive test names

```typescript
describe('AuthService', () => {
  it('should authenticate user with valid credentials', () => {
    // Test implementation
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in CI mode
npm run test:ci
```

## 📝 Code Style Guidelines

### TypeScript

```typescript
// ✅ Good
interface UserAccount {
  id: string;
  name: string;
  balance: number;
  isActive: boolean;
}

const getUserAccount = (userId: string): Observable<UserAccount> => {
  return this.http.get<UserAccount>(`/api/users/${userId}`);
};

// ❌ Bad
const getuser = (id) => {
  return this.http.get('/api/users/' + id);
};
```

### Angular Components

```typescript
// ✅ Good
@Component({
  selector: 'app-account-summary',
  templateUrl: './account-summary.component.html',
  styleUrls: ['./account-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountSummaryComponent implements OnInit {
  @Input() accountId!: string;
  @Output() accountSelected = new EventEmitter<string>();

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.loadAccountData();
  }
}
```

### CSS/SCSS

- Use BEM methodology
- Prefer CSS custom properties for theming
- Use responsive design principles

```scss
// ✅ Good
.account-card {
  &__header {
    display: flex;
    justify-content: space-between;
  }

  &__balance {
    font-size: var(--font-size-large);
    color: var(--color-primary);
  }

  &--premium {
    border: 2px solid var(--color-gold);
  }
}
```

## 🚨 Code Review Process

### As a Reviewer

- Review code within 24 hours
- Provide constructive feedback
- Test the changes locally if needed
- Approve only when confident in the changes

### As an Author

- Respond to feedback promptly
- Make requested changes
- Re-request review after updates
- Ensure CI passes before merging

## 🔧 Project Structure

```
src/
├── app/
│   ├── core/               # Singleton services, guards
│   │   ├── services/       # HTTP, auth, data services
│   │   ├── guards/         # Route guards
│   │   ├── interceptors/   # HTTP interceptors
│   │   ├── models/         # Data models, interfaces
│   │   └── utils/          # Utility functions
│   ├── shared/             # Shared components
│   │   ├── components/     # Reusable components
│   │   ├── directives/     # Custom directives
│   │   ├── pipes/          # Custom pipes
│   │   └── validators/     # Form validators
│   ├── features/           # Feature modules
│   │   ├── auth/           # Authentication
│   │   ├── accounts/       # Account management
│   │   ├── transactions/   # Transactions
│   │   └── ...
│   └── layout/             # Layout components
├── assets/                 # Static assets
└── environments/           # Environment configs
```

## 🎯 Best Practices

### Performance

- Use OnPush change detection
- Implement lazy loading for feature modules
- Optimize images and assets
- Use trackBy functions in *ngFor
- Implement virtual scrolling for large lists

### Security

- Sanitize user inputs
- Use HTTPS in production
- Implement proper authentication
- Validate all API responses
- Never expose sensitive data in console logs

### Accessibility

- Use semantic HTML
- Provide proper ARIA labels
- Ensure keyboard navigation
- Maintain color contrast ratios
- Test with screen readers

## 🐛 Issue Reporting

### Bug Reports

Include:
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/videos if applicable
- Browser/device information
- Console errors

### Feature Requests

Include:
- Clear description of the feature
- Business justification
- Proposed implementation approach
- UI/UX mockups if applicable

## 📞 Communication

### Daily Standups
- What you worked on yesterday
- What you're working on today
- Any blockers or help needed

### Code Discussions
- Use PR comments for code-specific discussions
- Use team chat for general questions
- Schedule meetings for complex architectural decisions

## 🎉 Recognition

We celebrate:
- First-time contributors
- Bug fixes that improve user experience
- Performance improvements
- Good documentation
- Helping team members

---

**Happy Coding! 🚀**

*Remember: Good code is not just working code, it's code that your teammates can understand and maintain.*
