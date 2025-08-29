# 🏦 Bank Masr - Banking System Application

![Angular](https://img.shields.io/badge/Angular-v17-red)
![TypeScript](https://img.shields.io/badge/TypeScript-v5.4-blue)
![Bootstrap](https://img.shields.io/badge/Bootstrap-v5.3-purple)
![Material UI](https://img.shields.io/badge/Angular_Material-v17-orange)

A comprehensive Angular banking system application built for Bank Masr and Sprints graduation project. This application demonstrates modern Angular development practices including routing, dependency injection, guards, pipes, enums, and HTTP services.

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Development](#-development)
- [API Endpoints](#-api-endpoints)
- [Authentication](#-authentication)
- [User Roles](#-user-roles)
- [Components](#-components)
- [Services](#-services)
- [Team Collaboration](#-team-collaboration)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

## 🎯 Project Overview

This Banking System Application provides a secure and user-friendly interface for managing banking operations. Users can perform various transactions, view account information, and administrators can manage users and monitor system activities.

### Key Objectives
- Demonstrate Angular routing and navigation
- Implement role-based authentication and authorization
- Showcase modern UI/UX design principles
- Integrate with RESTful APIs
- Provide a scalable and maintainable codebase

## ✨ Features

### 🔐 Authentication & Authorization
- Secure login with reactive forms and validation
- Role-based access control (Admin/User)
- JWT token management (simulated with localStorage)
- Session persistence and automatic logout

### 👤 User Features
- **Dashboard**: Overview of account balance and recent transactions
- **Account Management**: View account details and personal information
- **Transaction History**: Comprehensive transaction listing with filtering
- **Fund Transfer**: Secure money transfer between accounts
- **Profile Management**: Update user information

### 🛡️ Admin Features
- **User Management**: Create, read, update, and delete users
- **System Overview**: Monitor system activities and statistics
- **Account Control**: Activate/deactivate user accounts
- **Transaction Monitoring**: View all system transactions

### 🎨 UI/UX Features
- Responsive design for all device sizes
- Modern gradient-based color scheme
- Smooth animations and transitions
- Loading states and error handling
- Accessibility-compliant interface

## 🛠️ Tech Stack

### Frontend
- **Angular 17**: Latest Angular framework with standalone components
- **TypeScript 5.4**: Type-safe JavaScript development
- **RxJS**: Reactive programming for async operations
- **Angular Material**: UI component library
- **Bootstrap 5.3**: Responsive CSS framework
- **FontAwesome**: Icon library

### Development Tools
- **Angular CLI**: Project scaffolding and build tools
- **ESLint**: Code linting and quality checks
- **Prettier**: Code formatting
- **Husky**: Git hooks for code quality
- **Karma & Jasmine**: Unit testing framework

## 📁 Project Structure

```
src/
├── app/
│   ├── components/          # Reusable UI components
│   │   ├── admin-dashboard/
│   │   ├── admin-nav/
│   │   ├── admin-panel/
│   │   ├── fund-transfer/
│   │   ├── login/
│   │   ├── my-account/
│   │   ├── not-found/
│   │   ├── quick-action-card/
│   │   ├── service-card/
│   │   ├── stat-widget/
│   │   ├── transactions/
│   │   ├── user-dashboard/
│   │   └── user-nav/
│   ├── layouts/             # Layout components
│   │   ├── admin-layout/
│   │   ├── auth-layout/
│   │   └── user-layout/
│   ├── services/            # Business logic services
│   │   ├── auth.service.ts
│   │   ├── account.service.ts
│   │   └── transaction.service.ts
│   ├── models/              # TypeScript interfaces
│   │   ├── user.interface.ts
│   │   ├── account.interface.ts
│   │   └── transaction.interface.ts
│   ├── enums/               # TypeScript enums
│   │   ├── account-type.enum.ts
│   │   ├── transaction-type.enum.ts
│   │   └── user-role.enum.ts
│   ├── guards/              # Route protection
│   │   └── auth.guard.ts
│   ├── pipes/               # Custom pipes
│   │   └── transaction-filter.pipe.ts
│   ├── app.component.*
│   ├── app.config.ts
│   └── app.routes.ts
├── assets/                  # Static assets
├── environments/            # Environment configurations
└── styles.css              # Global styles
```

## 🚀 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (v17)

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Banking-System-main
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install Angular CLI globally (if not installed):**
   ```bash
   npm install -g @angular/cli@17
   ```

4. **Verify installation:**
   ```bash
   ng version
   ```

## 💻 Development

### Development Server
```bash
# Start development server
npm start
# or
ng serve

# Start with specific port
ng serve --port 4200

# Start with production configuration
npm run start:prod
```

Navigate to `http://localhost:4200/` to view the application.

### Build Commands
```bash
# Development build
npm run build:dev

# Production build
npm run build

# Staging build
npm run build:staging

# Analyze bundle size
npm run build:analyze
```

### Testing
```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in CI environment
npm run test:ci
```

### Code Quality
```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check code formatting
npm run format:check

# Type checking
npm run type-check
```

## 🌐 API Endpoints

The application integrates with MockAPI for account and transaction management:

### Base URL
```
https://68a063076e38a02c58188d9c.mockapi.io/bankingsystem
```

### Account Endpoints
```
GET    /Account           # Get all accounts
GET    /Account/:id       # Get account by ID
POST   /Account           # Create new account
PUT    /Account/:id       # Update account
DELETE /Account/:id       # Delete account
```

### Transaction Endpoints
```
GET    /Transaction       # Get all transactions
GET    /Transaction/:id   # Get transaction by ID
POST   /Transaction       # Create new transaction
PUT    /Transaction/:id   # Update transaction
DELETE /Transaction/:id   # Delete transaction
```

## 🔐 Authentication

### Demo Credentials

#### Admin Access
- **Username:** `admin`
- **Password:** `admin123`
- **Role:** Administrator

#### User Access
- **Username:** `user1` or `ahmed`
- **Password:** `user123` or `ahmed123`
- **Role:** User

### Authentication Flow
1. User enters credentials on login page
2. Credentials are validated against mock user data
3. Upon successful login, user data is stored in localStorage
4. AuthGuard protects routes based on user roles
5. Logout clears stored data and redirects to login

## 👥 User Roles

### User Role
- Access to personal dashboard
- View account information
- View transaction history
- Transfer funds to other accounts
- Update personal profile

### Admin Role
- Access to admin dashboard
- Manage all users (CRUD operations)
- View system statistics
- Monitor all transactions
- Activate/deactivate user accounts

## 🧩 Components

### Core Components

#### LoginComponent
- Reactive form with validation
- Role-based redirection
- Error handling and loading states
- Auto-fill demo credentials

#### UserDashboardComponent
- Account balance display
- Recent transactions overview
- Quick action buttons
- Responsive card layout

#### TransactionsComponent
- Paginated transaction list
- Filter by type (Credit/Debit)
- Search functionality
- Export capabilities

#### AdminPanelComponent
- User management interface
- CRUD operations for users
- Role assignment
- Account status management

### Layout Components

#### UserLayoutComponent
- Common layout for user pages
- Navigation integration
- Loading overlay
- Toast notifications

#### AdminLayoutComponent
- Admin-specific layout
- Enhanced navigation
- System monitoring widgets

## 🔧 Services

### AuthService
- User authentication and authorization
- Role-based access control
- Session management
- Mock user data handling

### AccountService
- Account CRUD operations
- Balance management
- Account number generation
- API integration

### TransactionService
- Transaction management
- Fund transfer logic
- Transaction filtering and search
- Statistics calculation

## 👨‍💻 Team Collaboration

### Code Style Guidelines
- Use TypeScript strict mode
- Follow Angular style guide
- Use meaningful variable and function names
- Add JSDoc comments for public methods
- Write unit tests for business logic

### Git Workflow
1. Create feature branches from `main`
2. Make atomic commits with descriptive messages
3. Run tests and linting before committing
4. Create pull requests for code review
5. Merge after approval and tests pass

### Component Development
1. Use standalone components
2. Implement OnInit and OnDestroy for lifecycle management
3. Use reactive forms for user input
4. Handle errors gracefully
5. Add loading states for async operations

### Styling Guidelines
- Use CSS custom properties for theming
- Follow mobile-first approach
- Use semantic HTML elements
- Ensure accessibility compliance
- Optimize for performance

## 🚀 Deployment

### Production Build
```bash
# Create production build
npm run build

# Serve production build locally
ng serve --configuration production
```

### Environment Configuration
Update environment files for different deployment targets:
- `environment.ts` - Development
- `environment.prod.ts` - Production
- `environment.staging.ts` - Staging

### Hosting Options
- **Firebase Hosting**: Simple deployment with Angular CLI
- **Netlify**: Automatic deployments from Git
- **Vercel**: Zero-configuration deployments
- **GitHub Pages**: Free hosting for open source

## 🤝 Contributing

### Getting Started
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run linting and tests
6. Submit a pull request

### Issue Reporting
When reporting issues, please include:
- Browser and version
- Node.js and npm versions
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

### Feature Requests
For feature requests, please provide:
- Clear description of the feature
- Use case and benefits
- Proposed implementation approach
- Any relevant mockups or designs

## 📝 Additional Notes

### Performance Optimization
- Use OnPush change detection strategy where possible
- Implement lazy loading for feature modules
- Optimize images and assets
- Use Angular CDK for common functionalities

### Security Considerations
- Validate all user inputs
- Sanitize data before display
- Use HTTPS in production
- Implement proper error handling
- Never expose sensitive data in client-side code

### Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## 📞 Support

For questions or support, please contact:
- **Team Lead**: Pierre
- **Project**: Bank Masr & Sprints Graduation Project
- **Framework**: Angular 17 with TypeScript

---

**Built with ❤️ by the Bank Masr Development Team**

*This project is part of the Sprints graduation program and serves as a demonstration of modern Angular development practices.*

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
