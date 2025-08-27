# Phase 2: Restaurants & Menus

This document outlines the implementation of Phase 2 features for the Food Order System, focusing on restaurant management and menu functionality.

## 🚀 New Features

### **Restaurant Management**
- **Create Restaurant Profile**: Restaurant owners can create detailed restaurant profiles
- **Edit Restaurant Details**: Update restaurant information, contact details, and cuisine type
- **Restaurant Listings**: Public view of all restaurants with search and filtering
- **Restaurant Cards**: Beautiful, responsive restaurant display cards

### **Menu Management**
- **CRUD Operations**: Full Create, Read, Update, Delete for menu items
- **Category Organization**: Organize menu items by categories (Appetizer, Main Course, etc.)
- **Availability Control**: Mark items as available/unavailable for ordering
- **Image Support**: Add images to menu items for better presentation

### **Customer Experience**
- **Browse Restaurants**: Customers can discover and explore restaurants
- **View Menus**: See complete restaurant menus with prices and descriptions
- **Search & Filter**: Find restaurants by name, description, or cuisine type
- **Responsive Design**: Mobile-friendly interface for all devices

## 🏗️ Architecture

### **API Endpoints**

#### **Restaurants**
- `GET /api/restaurants` - List all restaurants (public)
- `POST /api/restaurants` - Create new restaurant (RESTAURANT role only)
- `GET /api/restaurants/[id]` - Get restaurant details (public)
- `PUT /api/restaurants/[id]` - Update restaurant (owner only)
- `DELETE /api/restaurants/[id]` - Delete restaurant (owner only)

#### **Menu Items**
- `GET /api/restaurants/[id]/menu` - Get restaurant menu (public)
- `POST /api/restaurants/[id]/menu` - Add menu item (owner only)
- `PUT /api/restaurants/[id]/menu/[menuId]` - Update menu item (owner only)
- `DELETE /api/restaurants/[id]/menu/[menuId]` - Delete menu item (owner only)

### **Database Schema Updates**

```prisma
model Restaurant {
  id          String     @id @default(cuid())
  name        String
  address     String
  description String?    // NEW: Restaurant description
  phone       String?    // NEW: Contact phone number
  cuisine     String?    // NEW: Cuisine type
  imageUrl    String?    // NEW: Restaurant image
  owner       User       @relation(fields: [ownerId], references: [id])
  ownerId     String     @unique
  menuItems   MenuItem[]
  orders      Order[]
  createdAt   DateTime   @default(now())
}

model MenuItem {
  id           String     @id @default(cuid())
  name         String
  description  String?
  price        Float
  imageUrl     String?
  category     String?    // NEW: Menu item category
  isAvailable  Boolean    @default(true)  // NEW: Availability status
  restaurant   Restaurant @relation(fields: [restaurantId], references: [id])
  restaurantId String
  orderItems   OrderItem[]
}
```

## 🛠️ Setup Instructions

### **1. Database Migration**
```bash
# Generate Prisma client with new schema
npx prisma generate

# Create and apply migration
npx prisma migrate dev --name add_restaurant_menu_fields

# (Optional) Reset database for development
npx prisma migrate reset
```

### **2. Environment Variables**
Ensure your `.env` file includes:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/food_order_db"
JWT_SECRET="your-super-secret-jwt-key-here"
```

### **3. Install Dependencies**
```bash
npm install
```

### **4. Start Development Server**
```bash
npm run dev
```

## 📱 User Flows

### **Restaurant Owner Flow**
1. **Register** as RESTAURANT role
2. **Login** to access dashboard
3. **Create Restaurant Profile** with details
4. **Add Menu Items** with categories and prices
5. **Manage Menu** (edit, delete, toggle availability)
6. **Update Restaurant** information as needed

### **Customer Flow**
1. **Register** as CUSTOMER role (or browse as guest)
2. **Browse Restaurants** with search and filters
3. **View Restaurant Details** and complete menu
4. **Explore Menu Items** by category
5. **Prepare for Ordering** (Phase 3 feature)

### **Admin Flow**
1. **Access Admin Dashboard** with ADMIN role
2. **Monitor Restaurants** and user activity
3. **Manage System** and user accounts
4. **Oversee Operations** and resolve issues

## 🎨 UI Components

### **Restaurant Components**
- `RestaurantForm` - Create/edit restaurant profiles
- `RestaurantCard` - Display restaurant information
- `RestaurantList` - Grid layout for restaurant browsing

### **Menu Components**
- `MenuItemForm` - Add/edit menu items
- `MenuDisplay` - Show restaurant menu
- `CategoryFilter` - Filter menu by category

### **Navigation & Layout**
- Updated dashboard with restaurant management
- Enhanced home page with restaurant discovery
- Responsive design for all screen sizes

## 🔒 Security Features

### **Role-Based Access Control**
- **RESTAURANT Role**: Can create/manage their own restaurant
- **CUSTOMER Role**: Can browse restaurants and view menus
- **ADMIN Role**: Full system access and management

### **Data Protection**
- Restaurant owners can only edit their own restaurants
- Menu items are protected by restaurant ownership
- Public endpoints for browsing, protected for management

### **Input Validation**
- Comprehensive form validation
- Sanitized database inputs
- Error handling for all operations

## 🧪 Testing

### **Manual Testing Checklist**
- [ ] Restaurant owner registration and login
- [ ] Restaurant profile creation
- [ ] Menu item addition and management
- [ ] Customer browsing experience
- [ ] Search and filter functionality
- [ ] Responsive design on mobile/tablet
- [ ] Role-based access control
- [ ] Error handling and validation

### **API Testing**
```bash
# Test restaurant creation
curl -X POST /api/restaurants \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Restaurant","address":"123 Test St"}'

# Test menu item creation
curl -X POST /api/restaurants/RESTAURANT_ID/menu \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Item","price":9.99,"category":"Main Course"}'
```

## 🚧 Known Limitations

### **Current Phase**
- No image upload functionality (URLs only)
- No advanced search filters
- No restaurant ratings or reviews
- No order placement (Phase 3)

### **Future Enhancements**
- Image upload and management
- Advanced search with location
- Restaurant ratings and reviews
- Order management system
- Payment integration
- Delivery tracking

## 🐛 Troubleshooting

### **Common Issues**

#### **Database Connection Errors**
```bash
# Check database status
npx prisma db push

# Reset database (development only)
npx prisma migrate reset
```

#### **Authentication Issues**
- Verify JWT_SECRET in .env
- Check user role assignments
- Ensure proper token format

#### **Component Rendering Issues**
- Check browser console for errors
- Verify API endpoint responses
- Test with different user roles

### **Debug Mode**
Enable detailed logging:
```env
DEBUG=true
NODE_ENV=development
```

## 📚 API Documentation

### **Request/Response Examples**

#### **Create Restaurant**
```json
POST /api/restaurants
{
  "name": "Pizza Palace",
  "address": "456 Main Street",
  "description": "Best pizza in town!",
  "phone": "555-0123",
  "cuisine": "Italian"
}

Response: 201
{
  "message": "Restaurant created successfully",
  "restaurant": { ... }
}
```

#### **Add Menu Item**
```json
POST /api/restaurants/RESTAURANT_ID/menu
{
  "name": "Margherita Pizza",
  "description": "Classic tomato and mozzarella",
  "price": 14.99,
  "category": "Main Course",
  "isAvailable": true
}

Response: 201
{
  "message": "Menu item added successfully",
  "menuItem": { ... }
}
```

## 🔄 Next Steps (Phase 3)

### **Order Management**
- Shopping cart functionality
- Order placement and confirmation
- Order status tracking
- Payment processing

### **Enhanced Features**
- Real-time notifications
- Advanced search and filters
- Restaurant analytics
- Customer reviews and ratings

## 📞 Support

For technical support or questions:
1. Check the troubleshooting section
2. Review API documentation
3. Test with different user roles
4. Verify database schema and migrations

---

**Phase 2 Status**: ✅ Complete
**Next Phase**: Order Management & Shopping Cart
**Last Updated**: Current Date
