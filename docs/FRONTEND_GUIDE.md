# Frontend Development Guide

This document provides comprehensive information about the React TypeScript frontend application, including component architecture, state management, and development guidelines.

## 🏗️ Frontend Architecture

The frontend is built using modern React 19 with TypeScript, providing type safety and enhanced developer experience. The application uses Vite as the build tool for fast development and optimized production builds.

### Technology Stack
- **React 19**: Latest React with concurrent features
- **TypeScript**: Type-safe JavaScript development
- **Vite**: Fast build tool and development server
- **React Router**: Client-side routing
- **Redux Toolkit**: State management
- **Bootstrap**: UI framework for responsive design
- **Axios**: HTTP client for API communication

## 📁 Project Structure

```
my-store/
├── public/
│   └── vite.svg
├── src/
│   ├── components/           # React components
│   │   ├── Admin.tsx        # Admin main component
│   │   ├── AdminDashboard.tsx # Admin dashboard
│   │   ├── AdminLogin.tsx   # Admin authentication
│   │   ├── AdminProducts.tsx # Product management
│   │   ├── Buy.tsx          # Purchase flow
│   │   ├── Cart.tsx         # Shopping cart
│   │   ├── Login.tsx        # User authentication
│   │   ├── ProductDetail.tsx # Individual product view
│   │   ├── Products.tsx     # Product catalog
│   │   └── Register.tsx     # User registration
│   ├── assets/              # Static assets
│   │   └── react.svg
│   ├── App.css              # Global styles
│   ├── App.tsx              # Main application component
│   ├── index.css            # Base styles
│   ├── main.tsx             # Application entry point
│   └── vite-env.d.ts        # Vite type definitions
├── package.json              # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── tsconfig.app.json        # App-specific TypeScript config
├── tsconfig.node.json       # Node-specific TypeScript config
├── vite.config.ts           # Vite configuration
└── eslint.config.js         # ESLint configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn package manager

### Installation
```bash
cd my-store
npm install
```

### Development
```bash
npm run dev
```
The application will start at `http://localhost:5173`

### Build
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

## 🧩 Component Architecture

### Core Components

#### App.tsx
The main application component that sets up routing and renders the appropriate components based on the current URL.

```typescript
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/buy" element={<Buy />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-products" element={<AdminProducts />} />
      </Routes>
    </Router>
  );
}
```

#### Products.tsx
Main product catalog component that displays all available products with search and filtering capabilities.

**Features:**
- Product grid display
- Search functionality
- Price filtering
- Stock availability indicators
- Add to cart functionality

**Key Props:**
```typescript
interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  image: string;
  image_url: string;
}
```

#### ProductDetail.tsx
Detailed view of individual products with full information and purchase options.

**Features:**
- Product image gallery
- Detailed description
- Price and stock information
- Quantity selection
- Add to cart button
- Related products suggestions

#### Cart.tsx
Shopping cart management component for reviewing and modifying selected items.

**Features:**
- Cart item list
- Quantity adjustment
- Price calculations
- Remove items
- Proceed to checkout
- Cart persistence

#### Login.tsx & Register.tsx
User authentication components for account creation and login.

**Features:**
- Form validation
- Error handling
- Success messages
- Redirect after authentication
- Password strength indicators

#### Admin Components
Administrative interface for managing products, orders, and users.

**Admin.tsx**: Main admin dashboard
**AdminLogin.tsx**: Admin authentication
**AdminDashboard.tsx**: Overview and statistics
**AdminProducts.tsx**: Product management interface

## 🔄 State Management

The application uses Redux Toolkit for global state management, providing predictable state updates and efficient re-rendering.

### Store Structure
```typescript
interface RootState {
  cart: CartState;
  auth: AuthState;
  products: ProductsState;
  orders: OrdersState;
}
```

### Cart State
```typescript
interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}
```

### Auth State
```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
}
```

### Products State
```typescript
interface ProductsState {
  items: Product[];
  loading: boolean;
  error: string | null;
  filters: ProductFilters;
}
```

## 🌐 API Integration

The frontend communicates with the Django REST Framework backend through HTTP requests using Axios.

### API Configuration
```typescript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### API Endpoints
- **Products**: `GET/POST /products/`
- **Product Details**: `GET/PUT/DELETE /products/{id}/`
- **Orders**: `GET/POST /order/`
- **Authentication**: `POST /login/`, `POST /register/`
- **Admin**: `POST /admin-login/`, `POST /admin-register/`

### Error Handling
```typescript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);
```

## 🎨 Styling and UI

### CSS Architecture
- **Global Styles**: `index.css` and `App.css`
- **Component Styles**: Inline styles or CSS modules
- **Responsive Design**: Bootstrap grid system
- **Theme**: Consistent color scheme and typography

### Bootstrap Integration
The application uses Bootstrap 5 for responsive design and UI components:

```typescript
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
```

### Responsive Design
- Mobile-first approach
- Breakpoint-based layouts
- Touch-friendly interactions
- Optimized for various screen sizes

## 🔐 Authentication Flow

### User Authentication
1. **Registration**: User creates account with email/password
2. **Login**: User authenticates with credentials
3. **Session Management**: JWT tokens or session cookies
4. **Protected Routes**: Route guards for authenticated users

### Admin Authentication
1. **Admin Login**: Separate admin authentication
2. **Role Verification**: Check admin privileges
3. **Admin Routes**: Protected admin-only routes
4. **Permission Checks**: Verify admin actions

## 🛒 Shopping Cart Implementation

### Cart State Management
```typescript
const addToCart = (product: Product, quantity: number) => {
  dispatch(addItem({ product, quantity }));
};

const removeFromCart = (productId: number) => {
  dispatch(removeItem(productId));
};

const updateQuantity = (productId: number, quantity: number) => {
  dispatch(updateQuantity({ productId, quantity }));
};
```

### Cart Persistence
- Local storage for cart items
- Session-based cart management
- Cart synchronization across tabs

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 576px
- **Tablet**: 576px - 992px
- **Desktop**: > 992px

### Mobile Optimizations
- Touch-friendly buttons
- Swipe gestures for navigation
- Optimized form inputs
- Mobile-first navigation

## 🧪 Testing

### Testing Strategy
- **Unit Tests**: Component testing with React Testing Library
- **Integration Tests**: API integration testing
- **E2E Tests**: User flow testing
- **Accessibility Tests**: Screen reader compatibility

### Running Tests
```bash
npm test
npm run test:coverage
```

## 🚀 Performance Optimization

### Code Splitting
- Route-based code splitting
- Lazy loading of components
- Dynamic imports for heavy components

### Bundle Optimization
- Tree shaking for unused code
- Minification and compression
- Asset optimization
- CDN integration for static assets

## 🔧 Development Guidelines

### Code Style
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Conventional Commits**: Git commit message format

### Component Guidelines
- **Functional Components**: Use hooks for state and effects
- **Props Interface**: Define clear prop types
- **Error Boundaries**: Handle component errors gracefully
- **Loading States**: Show loading indicators for async operations

### State Management Rules
- **Local State**: Use useState for component-specific state
- **Global State**: Use Redux for shared state
- **Server State**: Use React Query or custom hooks
- **Form State**: Use controlled components or form libraries

## 🐛 Debugging

### Development Tools
- **React DevTools**: Component inspection and debugging
- **Redux DevTools**: State management debugging
- **Browser DevTools**: Network and console debugging
- **Vite HMR**: Hot module replacement for development

### Common Issues
- **CORS Errors**: Check API configuration
- **Authentication Issues**: Verify token/session handling
- **State Synchronization**: Check Redux store updates
- **API Errors**: Monitor network requests and responses

## 📦 Build and Deployment

### Build Process
1. **TypeScript Compilation**: Type checking and compilation
2. **Bundling**: Vite bundling with optimizations
3. **Asset Processing**: Image optimization and compression
4. **Environment Configuration**: Environment-specific settings

### Deployment Options
- **Static Hosting**: Netlify, Vercel, GitHub Pages
- **CDN**: CloudFront, Cloudflare
- **Container**: Docker containers
- **Server**: Node.js server with Express

### Environment Variables
```bash
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=My Store
VITE_APP_VERSION=1.0.0
```

## 🔮 Future Enhancements

### Planned Features
- **PWA Support**: Progressive web app capabilities
- **Offline Support**: Service worker implementation
- **Real-time Updates**: WebSocket integration
- **Advanced Search**: Elasticsearch integration
- **Payment Integration**: Stripe/PayPal support

### Performance Improvements
- **Virtual Scrolling**: For large product lists
- **Image Lazy Loading**: Progressive image loading
- **Caching Strategy**: Advanced caching mechanisms
- **Bundle Analysis**: Webpack bundle analyzer

## 📚 Additional Resources

### Documentation
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Redux Toolkit](https://redux-toolkit.js.org/)

### Learning Resources
- React tutorials and courses
- TypeScript best practices
- Modern JavaScript features
- State management patterns

### Community
- React community forums
- TypeScript community
- Frontend development groups
- Open source contributions
