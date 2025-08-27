# Authentication System Setup Guide

This guide will help you set up the complete authentication system for your Food Order application.

## Features

- **User Registration & Login**: Secure user authentication with JWT tokens
- **Role-Based Access Control**: Support for CUSTOMER, RESTAURANT, ADMIN, and DELIVERY roles
- **Protected Routes**: API and page-level protection based on user roles
- **Secure Password Handling**: Bcrypt password hashing
- **JWT Token Management**: Secure token-based authentication

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Prisma CLI

## Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set up Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/food_order_db"
   
   # JWT Secret (generate a strong secret for production)
   JWT_SECRET="your-super-secret-jwt-key-here"
   
   # Next.js
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret-here"
   ```

3. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate dev
   
   # (Optional) Seed database with sample data
   npx prisma db seed
   ```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts      # Login API
│   │   │   └── register/route.ts   # Registration API
│   │   ├── admin/
│   │   │   └── users/route.ts      # Admin-only user management
│   │   └── profile/route.ts        # Protected user profile
│   ├── login/page.tsx              # Login page
│   ├── register/page.tsx           # Registration page
│   ├── dashboard/page.tsx          # Role-based dashboard
│   └── unauthorized/page.tsx       # Access denied page
├── components/
│   └── auth/
│       ├── LoginForm.tsx           # Login form component
│       ├── RegisterForm.tsx        # Registration form component
│       └── ProtectedRoute.tsx      # Route protection component
├── contexts/
│   └── AuthContext.tsx             # Authentication context
└── lib/
    └── auth.ts                     # Authentication utilities
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Protected Routes
- `GET /api/profile` - Get user profile (requires auth)
- `PUT /api/profile` - Update user profile (requires auth)
- `GET /api/admin/users` - List all users (admin only)
- `POST /api/admin/users` - Update user role (admin only)

## Usage Examples

### Protecting a Route
```tsx
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function AdminPage() {
  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <div>Admin only content</div>
    </ProtectedRoute>
  );
}
```

### Using Authentication Context
```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, login, logout } = useAuth();
  
  if (user) {
    return (
      <div>
        <p>Welcome, {user.name}!</p>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }
  
  return <button onClick={() => login('email', 'password')}>Login</button>;
}
```

### API Route Protection
```tsx
import { requireRole } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const payload = requireRole(request, ['ADMIN', 'RESTAURANT']);
  
  if (!payload) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  }
  
  // Your protected logic here
}
```

## Security Features

- **Password Hashing**: Bcrypt with salt rounds
- **JWT Tokens**: Secure token-based authentication
- **Role Validation**: Server-side role checking
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Secure error responses

## Testing the System

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Register a new user**
   - Navigate to `/register`
   - Choose a role (CUSTOMER, RESTAURANT, or ADMIN)
   - Create an account

3. **Login**
   - Navigate to `/login`
   - Use your credentials to sign in

4. **Access Dashboard**
   - After login, you'll be redirected to `/dashboard`
   - Content will vary based on your role

## Production Considerations

- **Environment Variables**: Use strong, unique secrets
- **HTTPS**: Always use HTTPS in production
- **Rate Limiting**: Implement API rate limiting
- **Logging**: Add comprehensive logging
- **Monitoring**: Set up authentication monitoring
- **Backup**: Regular database backups

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify DATABASE_URL in .env
   - Ensure PostgreSQL is running
   - Check database permissions

2. **JWT Token Issues**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Ensure proper Authorization header format

3. **Role Access Denied**
   - Verify user role in database
   - Check route protection configuration
   - Ensure proper role validation

### Debug Mode
Enable debug logging by setting:
```env
DEBUG=true
```

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Check browser console for errors
4. Verify database state with Prisma Studio

## Next Steps

- Implement password reset functionality
- Add email verification
- Set up OAuth providers (Google, Facebook)
- Add two-factor authentication
- Implement session management
- Add audit logging
