# MediQuestAI - Development Guidelines

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   └── role-selection/    # Role selection page
├── components/            # Reusable React components
│   ├── ui/               # Base UI components (Button, Input, etc.)
│   └── ...               # Feature-specific components
├── config/               # Configuration files
│   ├── constants.ts      # Application constants
│   ├── env.ts           # Environment validation
│   └── firebase.ts      # Firebase configuration
├── contexts/             # React Context providers
├── hooks/               # Custom React hooks
├── services/            # Business logic and API calls
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
└── README_*.md          # Documentation files
```

## 🏗️ Architecture Principles

### 1. **Separation of Concerns**
- **Components**: Pure UI components with minimal business logic
- **Services**: Business logic and external API interactions
- **Hooks**: Reusable stateful logic
- **Utils**: Pure functions for data transformation and validation

### 2. **Type Safety**
- All components and functions should be properly typed
- Use TypeScript interfaces for data structures
- Avoid `any` types - use proper typing or `unknown`

### 3. **Error Handling**
- Use the centralized error handling system (`utils/errorHandler.ts`)
- Always handle async operations with proper error boundaries
- Provide meaningful error messages to users

### 4. **Validation**
- Use the validation utilities (`utils/validation.ts`)
- Validate data at form level and API boundaries
- Provide real-time feedback to users

## 🔧 Development Patterns

### Component Development

```typescript
// ✅ Good: Properly typed component with clear props
interface MyComponentProps {
  title: string;
  onAction: (id: string) => void;
  loading?: boolean;
}

export const MyComponent: React.FC<MyComponentProps> = ({
  title,
  onAction,
  loading = false
}) => {
  // Component implementation
};

// ❌ Bad: Untyped component with unclear props
export const MyComponent = ({ title, onAction, loading }) => {
  // Component implementation
};
```

### Custom Hooks

```typescript
// ✅ Good: Custom hook with proper typing and error handling
export function useUserData(userId: string) {
  const [data, setData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const [result, err] = await handleAsyncError(() => 
        getUserProfile(userId)
      );
      
      if (err) {
        setError(err);
      } else {
        setData(result);
      }
      setLoading(false);
    };

    fetchUser();
  }, [userId]);

  return { data, loading, error };
}
```

### Service Layer

```typescript
// ✅ Good: Service with proper error handling
export class UserService {
  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    const [result, error] = await handleAsyncError(async () => {
      // API call implementation
      return updatedProfile;
    });

    return {
      success: !error,
      data: result,
      error: error || undefined,
    };
  }
}
```

## 📝 Coding Standards

### 1. **Naming Conventions**
- **Components**: PascalCase (`UserProfile`, `AuthGuard`)
- **Functions/Variables**: camelCase (`getUserProfile`, `isLoading`)
- **Constants**: UPPER_SNAKE_CASE (`USER_ROLES`, `API_ENDPOINTS`)
- **Files**: kebab-case for utilities, PascalCase for components

### 2. **Import Organization**
```typescript
// 1. React and Next.js imports
import React from 'react';
import { useRouter } from 'next/navigation';

// 2. Third-party libraries
import { doc, getDoc } from 'firebase/firestore';

// 3. Internal imports (absolute paths)
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { validateEmail } from '@/utils/validation';

// 4. Relative imports
import './styles.css';
```

### 3. **Component Structure**
```typescript
// 1. Imports
import React, { useState, useEffect } from 'react';

// 2. Types/Interfaces
interface ComponentProps {
  // props definition
}

// 3. Component
export const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // 4. State
  const [state, setState] = useState();
  
  // 5. Hooks
  const { user } = useAuth();
  
  // 6. Effects
  useEffect(() => {
    // effect logic
  }, []);
  
  // 7. Event handlers
  const handleClick = () => {
    // handler logic
  };
  
  // 8. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};
```

## 🧪 Testing Guidelines

### Unit Tests
- Test individual functions and components in isolation
- Use meaningful test descriptions
- Test both success and error cases

### Integration Tests
- Test component interactions
- Test authentication flows
- Test form submissions

### E2E Tests
- Test complete user journeys
- Test critical business flows
- Test across different browsers

## 🚀 Performance Best Practices

### 1. **Code Splitting**
- Use dynamic imports for large components
- Implement route-based code splitting
- Lazy load non-critical components

### 2. **State Management**
- Keep state as local as possible
- Use Context sparingly for global state
- Implement proper memoization

### 3. **Bundle Optimization**
- Analyze bundle size regularly
- Remove unused dependencies
- Optimize images and assets

## 🔒 Security Guidelines

### 1. **Authentication**
- Never store sensitive data in localStorage
- Implement proper session management
- Use secure authentication flows

### 2. **Data Validation**
- Validate all user inputs
- Sanitize data before processing
- Implement proper authorization checks

### 3. **Environment Variables**
- Never commit sensitive keys to version control
- Use proper environment variable validation
- Implement different configs for different environments

## 📚 Adding New Features

### 1. **Planning**
- Define clear requirements
- Design component interfaces
- Plan data flow and state management

### 2. **Implementation**
- Start with types and interfaces
- Implement services and utilities
- Build components from bottom up
- Add proper error handling and validation

### 3. **Testing**
- Write unit tests for utilities
- Test components in isolation
- Add integration tests for flows

### 4. **Documentation**
- Update relevant README files
- Add inline code comments for complex logic
- Document API changes

## 🔄 Maintenance

### Regular Tasks
- Update dependencies regularly
- Review and refactor code
- Monitor performance metrics
- Update documentation

### Code Reviews
- Check for proper typing
- Verify error handling
- Ensure consistent patterns
- Review security implications

## 📖 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)