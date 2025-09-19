# Types Documentation

This folder contains TypeScript interfaces and types for the application.

## Files

### `user.ts`
- `User`: Complete user interface matching the API response
- `UserProfile`: Simplified user interface for profile display

### `auth.ts`
- `LoginRequest`: Login form data structure
- `RegisterRequest`: Registration form data structure
- `LoginResponse`: API response structure for login
- `RegisterResponse`: API response structure for registration
- `AuthUser`: User data stored in AuthContext
- `AuthState`: Complete authentication state
- `AuthErrorResponse`: Error response structure

## Usage Examples

### Using AuthContext with User Data

```typescript
import { useAuth } from '@/hooks/useAuth';

const MyComponent = () => {
  const { user, token, isAuthenticated, login, logout } = useAuth();

  if (isAuthenticated && user) {
    return (
      <div>
        <h1>Welcome, {user.first_name} {user.last_name}!</h1>
        <p>Email: {user.email}</p>
        <p>Mobile: {user.mobile}</p>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  return <div>Please log in</div>;
};
```

### API Response Handling

```typescript
// Login response structure
{
  status: true,
  message: "Login successful",
  data: {
    token: "1|4oXtl5P34yfiKZKQQsnq2PkPGz4hCLyNxxGmPlc0c9f6b137",
    user: {
      id: 3,
      first_name: "test",
      last_name: "test",
      email: "abhishek@yopmail.com",
      mobile: "654654654",
      country_code: "2",
      address: null,
      date_of_birth: null,
      gender: null,
      nationality: null,
      passport_number: null
    }
  }
}
```
