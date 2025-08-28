# Bank Masr - Banking System 🏦

> **Graduation Project** - A modern, high-performance banking application built with Angular 17, developed in collaboration with Bank Masr and Sprints.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- Git

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd Banking-System-main

# Install dependencies
npm install

# Start development server
npm start
```

Navigate to `http://localhost:4200/` - the app will automatically reload when you make changes.

## 🛠️ Development

### Available Scripts

```bash
# Development
npm start              # Start development server
npm run watch          # Build and watch for changes

# Testing
npm test               # Run unit tests
npm run test:coverage  # Run tests with coverage

# Build
npm run build          # Production build
npm run build:dev      # Development build

# Code Quality
npm run lint           # Run ESLint
npm run format         # Format code with Prettier
npm run type-check     # TypeScript type checking
```

### Project Structure

```
src/
├── app/
│   ├── core/          # Singleton services, guards
│   ├── shared/        # Shared components, directives, pipes
│   ├── features/      # Feature modules
│   │   ├── auth/      # Authentication
│   │   ├── accounts/  # Account management
│   │   ├── transactions/ # Transaction handling
│   │   └── dashboard/ # Main dashboard
│   └── layout/        # Layout components
├── assets/            # Static assets
└── environments/      # Environment configurations
```

## 🏗️ Architecture

- **Framework**: Angular 17 with SSR (Server-Side Rendering)
- **UI Framework**: Angular Material + Bootstrap 5
- **Icons**: FontAwesome
- **State Management**: NgRx (planned)
- **HTTP Client**: Angular HttpClient with interceptors
- **Styling**: CSS3 + SCSS

## 👥 Team Development

### Branching Strategy

- `main` - Production-ready code
- `develop` - Integration branch
- `feature/feature-name` - Feature branches
- `bugfix/bug-description` - Bug fixes
- `hotfix/critical-fix` - Critical fixes

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add user authentication
fix: resolve login validation issue
docs: update API documentation
style: format code according to guidelines
refactor: optimize account service
test: add unit tests for transaction component
```

### Code Review Process

1. Create feature branch from `develop`
2. Make changes and commit with conventional format
3. Create Pull Request to `develop`
4. Request review from at least 2 team members
5. Address feedback and merge

## 🚀 Performance Optimizations

- **Lazy Loading**: Feature modules loaded on demand
- **OnPush Change Detection**: Optimized change detection
- **Track By Functions**: Efficient *ngFor rendering
- **Image Optimization**: WebP format with fallbacks
- **Bundle Splitting**: Vendor and app bundles separated
- **Service Workers**: Caching and offline support
- **SSR**: Server-side rendering for faster initial load

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **HTTPS**: All communications encrypted
- **CSP**: Content Security Policy headers
- **XSS Protection**: Input sanitization
- **CSRF Protection**: Cross-site request forgery prevention

## 📱 Banking Features

### Planned Modules

- [ ] User Authentication & Authorization
- [ ] Account Management
- [ ] Transaction Processing
- [ ] Bill Payments
- [ ] Money Transfers
- [ ] Credit Card Management
- [ ] Loan Applications
- [ ] Financial Reports
- [ ] Customer Support
- [ ] Admin Dashboard

## 🧪 Testing

```bash
# Unit tests
npm test

# E2E tests
npm run e2e

# Coverage report
npm run test:coverage
```

## 📦 Deployment

### Production Build

```bash
npm run build
# Files will be in dist/banking-system/
```

### Environment Setup

- Development: `src/environments/environment.ts`
- Production: `src/environments/environment.prod.ts`
- Staging: `src/environments/environment.staging.ts`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is part of a graduation project in collaboration with Bank Masr and Sprints.

## 🔗 Resources

- [Angular Documentation](https://angular.io/docs)
- [Angular Material](https://material.angular.io/)
- [Bootstrap 5](https://getbootstrap.com/docs/5.0/)
- [Bank Masr](https://www.banquemisr.com/)
- [Sprints](https://sprints.ai/)

## 🆘 Support

For project-related questions, please contact the development team or create an issue in the repository.

---

**Built with ❤️ by the Bank Masr Graduation Project Team**
