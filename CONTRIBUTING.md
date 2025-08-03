# Contributing to ContraMind

We're thrilled that you're interested in contributing to ContraMind! This document provides guidelines for contributing to the project.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Community](#community)

## Code of Conduct

### Our Pledge
We are committed to providing a welcoming and inspiring community for all. Contributors are expected to:
- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior
- Harassment, discriminatory language, or personal attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

## Getting Started

### Prerequisites
1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/yourusername/contramind.git
   cd contramind
   ```
3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/contramind/contramind.git
   ```

### Development Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
3. Set up the database:
   ```bash
   npm run db:push
   ```
4. Start development server:
   ```bash
   npm run dev
   ```

## Development Process

### 1. Create a Branch
Always create a new branch for your work:
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b bugfix/issue-description
```

### 2. Make Your Changes
- Write clean, readable code
- Add appropriate comments
- Update documentation if needed
- Write or update tests for your changes

### 3. Test Your Changes
```bash
# Run type checking
npm run typecheck

# Run linting
npm run lint

# Run tests
npm test

# Test the application manually
npm run dev
```

### 4. Commit Your Changes
Follow our commit message conventions (see below).

### 5. Push and Create a Pull Request
```bash
git push origin feature/your-feature-name
```
Then create a pull request on GitHub.

## Coding Standards

### TypeScript Guidelines
```typescript
// Use explicit types
interface UserData {
  id: string;
  email: string;
  name: string;
}

// Avoid 'any' type
function processUser(user: UserData): void {
  // Implementation
}

// Use enums for constants
enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

// Document complex functions
/**
 * Processes contract data and returns risk assessment
 * @param contract - The contract to analyze
 * @returns Risk assessment result
 */
function analyzeContract(contract: Contract): RiskAssessment {
  // Implementation
}
```

### React Best Practices
```typescript
// Use functional components with hooks
export function Component({ prop }: Props) {
  const [state, setState] = useState<string>('');
  
  // Use useCallback for event handlers
  const handleClick = useCallback(() => {
    // Handle click
  }, [dependency]);
  
  return <div onClick={handleClick}>{state}</div>;
}

// Use proper prop types
interface ComponentProps {
  title: string;
  onSave: (data: FormData) => void;
  children: React.ReactNode;
}
```

### CSS/Styling Guidelines
- Use Tailwind CSS utilities first
- Use CSS modules for complex component-specific styles
- Follow mobile-first responsive design
- Maintain consistent spacing and colors from the design system

### File Organization
```
src/
├── components/      # Reusable components
│   ├── ui/         # Basic UI components
│   └── ...         # Feature components
├── pages/          # Page components
├── hooks/          # Custom React hooks
├── lib/            # Utilities and helpers
├── contexts/       # React contexts
└── types/          # TypeScript type definitions
```

## Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements

### Examples
```bash
feat(auth): add Google OAuth integration

- Implement Google OAuth strategy
- Add login button component
- Update user schema for OAuth data

Closes #123

---

fix(contracts): correct risk calculation for payment terms

The risk level was not properly calculated when payment
terms exceeded 60 days. This fix ensures proper risk
assessment for extended payment schedules.

---

docs(api): update contract upload endpoint documentation

- Add missing parameters
- Include example responses
- Document error codes
```

## Pull Request Process

### Before Submitting
1. **Update your branch**:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Ensure all tests pass**

3. **Update documentation** if you've made API changes

4. **Add tests** for new functionality

### PR Template
When creating a pull request, please include:
- **Description**: Clear explanation of changes
- **Related Issue**: Link to related issue(s)
- **Type of Change**: Bug fix, feature, etc.
- **Testing**: How you tested the changes
- **Screenshots**: For UI changes

### Review Process
1. At least one maintainer review is required
2. All CI checks must pass
3. No merge conflicts
4. Code coverage should not decrease

## Issue Guidelines

### Bug Reports
Please include:
- Clear, descriptive title
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment details (OS, browser, etc.)
- Screenshots if applicable
- Error messages and logs

### Feature Requests
Please include:
- Clear problem statement
- Proposed solution
- Alternative solutions considered
- Additional context

### Good First Issues
Look for issues labeled `good first issue` if you're new to the project.

## Community

### Communication Channels
- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussions
- **Email**: dev@contramind.ai for security issues

### Getting Help
- Check existing documentation
- Search closed issues
- Ask in GitHub Discussions
- Reach out to maintainers

## Recognition

Contributors will be recognized in:
- The project README
- Release notes
- Our website's contributors page

## License

By contributing to ContraMind, you agree that your contributions will be licensed under the project's MIT License.

---

Thank you for contributing to ContraMind! Your efforts help make contract management better for everyone.