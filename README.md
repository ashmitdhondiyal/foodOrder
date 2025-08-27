# FoodOrder - Food Delivery Platform

## 🍕 Project Overview

**FoodOrder** is a comprehensive food delivery platform built as a college project that demonstrates modern web development practices, full-stack architecture, and real-world application development. The platform enables customers to order food from restaurants, with support for delivery tracking, payment processing, and multi-role user management.

## 🎯 Project Objectives

- **Educational Purpose**: Demonstrate full-stack web development skills
- **Real-world Application**: Build a production-ready food delivery system
- **Modern Technologies**: Showcase current industry-standard tools and frameworks
- **Scalable Architecture**: Implement a robust, maintainable codebase
- **User Experience**: Create an intuitive and responsive user interface

## 🚀 Technologies Used

### Frontend Technologies
- **Next.js 15.5.2** - React framework with App Router
- **React 19.1.0** - Modern React with latest features
- **TypeScript 5** - Type-safe JavaScript development
- **Tailwind CSS 4** - Utility-first CSS framework
- **ESLint** - Code quality and consistency

### Backend Technologies
- **Next.js API Routes** - Server-side API endpoints
- **Prisma 5.0.0** - Modern database ORM
- **PostgreSQL** - Relational database
- **JWT (jsonwebtoken)** - Authentication tokens
- **bcryptjs** - Password hashing

### Payment & External Services
- **Stripe** - Payment processing and gateway
- **Stripe Webhooks** - Real-time payment updates

### Development Tools
- **Prisma Studio** - Database management interface
- **ESLint** - Code linting and formatting
- **TypeScript** - Static type checking

## 🏗️ System Architecture

### Database Schema
The application uses a comprehensive database design with the following entities:

- **User Management**: Multi-role user system (Customer, Restaurant, Admin, Delivery)
- **Restaurant System**: Restaurant profiles, menus, and menu items
- **Order Management**: Complete order lifecycle from creation to delivery
- **Payment System**: Secure payment processing with Stripe integration
- **Delivery Tracking**: Real-time delivery status and tracking

### API Structure
- **Authentication**: `/api/auth/*` - Login, registration, and token management
- **Restaurants**: `/api/restaurants/*` - Restaurant CRUD operations
- **Orders**: `/api/orders/*` - Order management and status updates
- **Payments**: `/api/payments/*` - Payment processing and webhooks
- **Delivery**: `/api/deliveries/*` - Delivery assignment and tracking
- **Admin**: `/api/admin/*` - Administrative functions

## ✨ Features & Functionality

### 🧑‍💼 Multi-Role User System
- **Customer Role**
  - Browse restaurants and menus
  - Add items to shopping cart
  - Place orders with special instructions
  - Track order status and delivery
  - View order history
  - Secure payment processing

- **Restaurant Role**
  - Restaurant profile management
  - Menu item creation and editing
  - Order management and status updates
  - View customer orders and details
  - Set availability and pricing

- **Delivery Role**
  - Accept delivery assignments
  - Update delivery status
  - Track delivery progress
  - Customer communication
  - Delivery completion confirmation

- **Admin Role**
  - User management and role assignment
  - System monitoring and oversight
  - Restaurant approval and management
  - Order and delivery oversight

### 🛒 Shopping Cart System
- Add/remove menu items
- Quantity management
- Real-time price calculation
- Restaurant-specific cart validation
- Special instructions support

### 📱 Order Management
- Complete order lifecycle tracking
- Status updates (Pending → Confirmed → Preparing → Ready → Out for Delivery → Delivered)
- Estimated completion times
- Special instructions handling
- Order history and tracking

### 💳 Payment Processing
- Secure Stripe integration
- Multiple payment methods
- Real-time payment status updates
- Webhook-based payment confirmation
- Refund processing capabilities

### 🚚 Delivery System
- Automated delivery assignment
- Real-time delivery tracking
- Driver status updates
- Estimated delivery times
- Delivery notes and communication

### 🔐 Security Features
- JWT-based authentication
- Role-based access control
- Password hashing with bcrypt
- Protected API routes
- Input validation and sanitization

## 🎨 User Interface Features

### Responsive Design
- Mobile-first approach
- Cross-device compatibility
- Modern, intuitive design
- Accessibility considerations

### Real-time Updates
- Live order status updates
- Real-time delivery tracking
- Dynamic cart updates
- Instant payment confirmations

### User Experience
- Smooth navigation flow
- Clear visual feedback
- Loading states and animations
- Error handling and user guidance

## 📊 Use Cases & Scenarios

### Customer Journey
1. **Registration/Login**: User creates account or signs in
2. **Restaurant Discovery**: Browse available restaurants and cuisines
3. **Menu Selection**: View restaurant menus and add items to cart
4. **Order Placement**: Complete order with special instructions
5. **Payment**: Secure payment processing via Stripe
6. **Order Tracking**: Monitor order status and delivery progress
7. **Delivery**: Receive food and confirm delivery

### Restaurant Operations
1. **Profile Setup**: Create and manage restaurant profile
2. **Menu Management**: Add, edit, and manage menu items
3. **Order Processing**: Receive and manage incoming orders
4. **Status Updates**: Update order preparation status
5. **Customer Communication**: Handle special requests and instructions

### Delivery Operations
1. **Assignment**: Receive delivery assignments from system
2. **Pickup**: Collect orders from restaurants
3. **Delivery**: Transport orders to customers
4. **Status Updates**: Keep customers informed of progress
5. **Completion**: Confirm successful delivery

### Administrative Functions
1. **User Management**: Monitor and manage user accounts
2. **System Oversight**: Monitor platform operations
3. **Restaurant Approval**: Manage restaurant registrations
4. **Issue Resolution**: Handle disputes and problems

## 🛠️ Technical Implementation

### State Management
- **React Context API**: Global state management
- **Local Storage**: Persistent cart and authentication data
- **Server State**: Real-time data synchronization

### Database Design
- **Normalized Schema**: Efficient data relationships
- **Indexing**: Optimized query performance
- **Migrations**: Version-controlled database changes
- **Relationships**: Proper foreign key constraints

### API Design
- **RESTful Endpoints**: Standard HTTP methods and status codes
- **Middleware**: Authentication and authorization checks
- **Error Handling**: Comprehensive error responses
- **Validation**: Input validation and sanitization

### Security Implementation
- **JWT Tokens**: Secure authentication mechanism
- **Password Hashing**: Bcrypt with salt rounds
- **Role Validation**: Server-side access control
- **Input Sanitization**: XSS and injection prevention

## 📁 Project Structure

```
food_order/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API endpoints
│   │   ├── components/        # Reusable UI components
│   │   ├── contexts/          # React contexts
│   │   └── lib/               # Utility functions
│   ├── prisma/                # Database schema and migrations
│   └── public/                # Static assets
├── components/                 # Shared components
├── contexts/                   # React context providers
├── lib/                        # Utility libraries
└── docs/                       # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- Stripe account (for payments)

### Installation
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd food_order
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   # Configure your environment variables
   ```

4. **Database setup**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## 🔧 Configuration

### Environment Variables
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/food_order_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### Database Configuration
- PostgreSQL database
- Prisma ORM for database operations
- Automatic migrations and schema generation

## 📚 Learning Outcomes

### Technical Skills Demonstrated
- **Full-Stack Development**: Complete application from database to UI
- **Modern Web Technologies**: Next.js, React, TypeScript
- **Database Design**: Relational database modeling and optimization
- **API Development**: RESTful API design and implementation
- **Authentication & Security**: JWT, role-based access control
- **Payment Integration**: Third-party service integration
- **State Management**: React Context API and local storage
- **Responsive Design**: Mobile-first UI/UX development

### Software Engineering Practices
- **Version Control**: Git workflow and collaboration
- **Code Quality**: ESLint, TypeScript, and best practices
- **Database Migrations**: Schema version control
- **Error Handling**: Comprehensive error management
- **Testing**: Component and integration testing
- **Documentation**: Comprehensive project documentation

### Real-world Application Development
- **User Experience**: Customer-focused design
- **Business Logic**: Complex workflow implementation
- **Scalability**: Architecture designed for growth
- **Security**: Production-ready security measures
- **Performance**: Optimized database queries and UI

## 🔮 Future Enhancements

### Planned Features
- **Real-time Chat**: Customer-restaurant-driver communication
- **Push Notifications**: Order status updates
- **Analytics Dashboard**: Business insights and reporting
- **Mobile App**: Native mobile applications
- **AI Recommendations**: Personalized restaurant suggestions
- **Loyalty Program**: Customer rewards and incentives

### Technical Improvements
- **Performance Optimization**: Caching and CDN integration
- **Testing Coverage**: Comprehensive test suite
- **CI/CD Pipeline**: Automated deployment
- **Monitoring**: Application performance monitoring
- **Backup Strategy**: Automated database backups

## 📖 Additional Documentation

- [Authentication Setup Guide](food_order/AUTH_SETUP.md)
- [Stripe Payment Setup](food_order/STRIPE_SETUP.md)
- [API Documentation](docs/api.md)
- [Database Schema](docs/database.md)
- [Deployment Guide](docs/deployment.md)

## 🤝 Contributing

This is a college project demonstrating individual development skills. The codebase serves as a portfolio piece showcasing:

- Full-stack development capabilities
- Modern technology stack proficiency
- Real-world problem-solving skills
- Professional code quality standards
- Comprehensive project documentation

## 📄 License

This project is created for educational purposes as part of a college curriculum. All rights reserved.

## 👨‍🎓 Student Information

**Project Type**: College Assignment  
**Course**: Web Development / Full-Stack Development  
**Technologies**: Next.js, React, TypeScript, PostgreSQL, Prisma, Stripe  
**Duration**: Academic Semester  
**Grade**: [To be determined]

---

*This project demonstrates comprehensive understanding of modern web development practices, full-stack architecture, and real-world application development skills.*