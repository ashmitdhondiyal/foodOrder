# Phase 3: Orders (Core MVP)

This document outlines the implementation of Phase 3 features for the Food Order System, focusing on the core order management functionality.

## 🚀 New Features

### **Shopping Cart System**
- **Add to Cart**: Customers can add menu items to their shopping cart
- **Cart Management**: View, update quantities, and remove items
- **Restaurant Isolation**: Cart only allows items from one restaurant at a time
- **Persistent Storage**: Cart data saved in localStorage
- **Real-time Updates**: Cart updates immediately across all components

### **Order Management**
- **Order Creation**: Customers can place orders with special instructions
- **Order Status Flow**: PENDING → CONFIRMED → PREPARING → READY
- **Order Tracking**: Real-time status updates for customers
- **Order History**: Complete order history for both customers and restaurants

### **Restaurant Order Management**
- **Order Reception**: Restaurants receive and view incoming orders
- **Status Updates**: Update order status through the workflow
- **Estimated Times**: Set estimated completion times for customers
- **Order Cancellation**: Cancel orders if needed

## 🏗️ Architecture

### **API Endpoints**

#### **Orders**
- `GET /api/orders` - Get user's orders (authenticated users)
- `POST /api/orders` - Create new order (customers only)
- `GET /api/orders/[id]` - Get order details
- `PUT /api/orders/[id]` - Update order status (restaurant owners only)

### **Database Schema Updates**

```prisma
model Order {
  id           String       @id @default(cuid())
  customer     User         @relation(fields: [customerId], references: [id])
  customerId   String
  restaurant   Restaurant   @relation(fields: [restaurantId], references: [id])
  restaurantId String
  items        OrderItem[]
  delivery     Delivery?
  payment      Payment?
  status       OrderStatus  @default(PENDING)
  estimatedTime DateTime?   // NEW: Estimated completion time
  specialInstructions String? // NEW: Customer special instructions
  createdAt    DateTime     @default(now())
}

model OrderItem {
  id        String   @id @default(cuid())
  order     Order    @relation(fields: [orderId], references: [id])
  orderId   String
  menuItem  MenuItem @relation(fields: [menuItemId], references: [id])
  menuItemId String
  quantity  Int
  price     Float    // NEW: Price at time of order
}
```

### **Order Status Flow**

```
PENDING → CONFIRMED → PREPARING → READY
   ↓
CANCELLED (can happen at any time)
```

## 🛠️ Setup Instructions

### **1. Database Migration**
```bash
# Generate Prisma client with new schema
npx prisma generate

# Create and apply migration
npx prisma migrate dev --name add_order_fields

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

### **Customer Order Flow**
1. **Browse Restaurants** - View available restaurants and menus
2. **Add to Cart** - Select items and add to shopping cart
3. **Cart Management** - Review items, adjust quantities, add special instructions
4. **Checkout** - Place order with payment information (Phase 4)
5. **Order Tracking** - Monitor order status through the workflow
6. **Order History** - View past orders and reorder favorite items

### **Restaurant Order Management Flow**
1. **Receive Orders** - View incoming orders in real-time
2. **Confirm Orders** - Accept orders and set estimated completion times
3. **Update Status** - Progress orders through preparation stages
4. **Order Completion** - Mark orders as ready for pickup/delivery
5. **Order History** - Track completed and cancelled orders

### **Admin Flow**
1. **Monitor Orders** - View all system orders and status
2. **System Analytics** - Track order volumes and restaurant performance
3. **Issue Resolution** - Handle customer complaints and order disputes

## 🎨 UI Components

### **Shopping Cart Components**
- `CartContext` - Global cart state management
- `CartItem` - Individual cart item display with quantity controls
- `ShoppingCart` - Complete cart page with checkout functionality

### **Order Management Components**
- `OrderCard` - Order information display with status indicators
- `OrderStatusManager` - Restaurant order status update interface
- `OrdersPage` - Order listing with filtering and management

### **Integration Components**
- Updated dashboard with cart summary and order links
- Enhanced home page with shopping cart icon
- Navigation updates for order management

## 🔒 Security Features

### **Role-Based Access Control**
- **CUSTOMER Role**: Can create orders and view their own orders
- **RESTAURANT Role**: Can manage orders for their restaurant only
- **ADMIN Role**: Full system access and order monitoring

### **Data Protection**
- Customers can only view their own orders
- Restaurant owners can only manage their restaurant's orders
- Order status updates require proper authentication
- Cart data isolated by restaurant

### **Input Validation**
- Comprehensive order validation
- Quantity and price verification
- Restaurant ownership verification
- Status transition validation

## 🧪 Testing

### **Manual Testing Checklist**
- [ ] Customer adds items to cart
- [ ] Cart updates across all components
- [ ] Order placement with special instructions
- [ ] Order status updates by restaurant
- [ ] Order tracking by customer
- [ ] Cart isolation between restaurants
- [ ] Order cancellation functionality
- [ ] Estimated time setting and display

### **API Testing**
```bash
# Test order creation
curl -X POST /api/orders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"restaurantId":"RESTAURANT_ID","items":[{"menuItemId":"ITEM_ID","quantity":2}],"specialInstructions":"Extra cheese please"}'

# Test order status update
curl -X PUT /api/orders/ORDER_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"CONFIRMED","estimatedTime":"2024-01-15T18:30:00Z"}'
```

## 🚧 Known Limitations

### **Current Phase**
- No payment processing (Phase 4)
- No delivery tracking (Phase 5)
- No real-time notifications
- No order modifications after placement
- No bulk order operations

### **Future Enhancements**
- Payment integration (Stripe, PayPal)
- Real-time order notifications
- Order modification capabilities
- Advanced order analytics
- Delivery partner integration
- Customer reviews and ratings

## 🐛 Troubleshooting

### **Common Issues**

#### **Cart Not Persisting**
- Check localStorage permissions
- Verify CartProvider is wrapping the app
- Check for JavaScript errors in console

#### **Order Creation Fails**
- Verify user authentication
- Check user role (must be CUSTOMER)
- Validate restaurant and menu item IDs
- Ensure all required fields are provided

#### **Status Update Issues**
- Verify restaurant ownership
- Check order status transitions
- Validate estimated time format
- Ensure proper authentication

### **Debug Mode**
Enable detailed logging:
```env
DEBUG=true
NODE_ENV=development
```

## 📚 API Documentation

### **Request/Response Examples**

#### **Create Order**
```json
POST /api/orders
{
  "restaurantId": "restaurant_id_here",
  "items": [
    {
      "menuItemId": "menu_item_id_here",
      "quantity": 2
    }
  ],
  "specialInstructions": "Extra spicy, no onions"
}

Response: 201
{
  "message": "Order created successfully",
  "order": { ... }
}
```

#### **Update Order Status**
```json
PUT /api/orders/order_id_here
{
  "status": "CONFIRMED",
  "estimatedTime": "2024-01-15T18:30:00Z"
}

Response: 200
{
  "message": "Order status updated successfully",
  "order": { ... }
}
```

## 🔄 Next Steps (Phase 4)

### **Payment Integration**
- Payment processing (Stripe integration)
- Order confirmation emails
- Receipt generation
- Refund handling

### **Enhanced Order Features**
- Order scheduling
- Recurring orders
- Order templates
- Group ordering

## 📞 Support

For technical support or questions:
1. Check the troubleshooting section
2. Review API documentation
3. Test with different user roles
4. Verify database schema and migrations
5. Check browser console for errors

---

**Phase 3 Status**: ✅ Complete
**Next Phase**: Payment Integration & Order Confirmation
**Last Updated**: Current Date
