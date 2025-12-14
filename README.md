# Product Inventory & Order Management Dashboard

A modern, full-stack inventory management system built with Next.js 16, Redux Toolkit, Prisma ORM, and Neon PostgreSQL.

![Dashboard Preview](https://github.com/najathi/inventory-dashboard/raw/refs/heads/main/demonstration.mp4)

## 🚀 Features

### Core Functionality
- **Product Management**
  - Browse products with advanced filtering (search, category, price range)
  - Client-side pagination for optimal performance
  - Detailed product view with editing capabilities
  - Real-time stock quantity management
  - Active/Inactive status toggling
  - Material UI DataGrid integration

- **Order Management**
  - Comprehensive order listing with sorting and filtering
  - Visual status badges (Pending, Shipped, Delivered, Cancelled)
  - Order statistics dashboard
  - Real-time order updates

- **Dashboard Analytics**
  - Key metrics overview (total products, orders, revenue)
  - Order status distribution charts
  - Product category breakdown
  - Real-time data synchronization

### Technical Features
- **Next.js 16** with App Router and Server Components
- **Redux Toolkit** for predictable state management
- **Prisma ORM** with Neon PostgreSQL for scalable database
- **TanStack Form** for type-safe form handling
- **Material UI** for consistent, beautiful UI components
- **TypeScript** for type safety
- **Server-side caching** with Next.js unstable_cache
- **Dark/Light mode** toggle
- **Responsive design** for all devices
- **Error handling** with toast notifications
- **Optimistic updates** for better UX

## 📁 Project Structure

```
inventory-dashboard/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data script
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── api/              # API routes
│   │   ├── products/         # Product pages
│   │   ├── orders/           # Order pages
│   │   └── layout.tsx        # Root layout
│   ├── components/           # React components
│   │   ├── layout/          # Layout components
│   │   ├── products/        # Product components
│   │   ├── orders/          # Order components
│   │   └── ui/              # Reusable UI components
│   ├── features/            # Redux slices
│   │   ├── products/        # Product state management
│   │   └── orders/          # Order state management
│   ├── lib/                 # Utilities
│   │   ├── prisma.ts       # Prisma client
│   │   ├── store.ts        # Redux store
│   │   └── providers.tsx   # Context providers
│   ├── services/           # API services
│   │   ├── productService.ts
│   │   └── orderService.ts
│   ├── types/              # TypeScript types
│   │   ├── product.ts
│   │   └── order.ts
│   └── hooks/              # Custom hooks
├── .env                    # Environment variables
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database (Neon recommended)

### Step 1: Clone and Install

```bash
git clone https://github.com/najathi/inventory-dashboard.git
cd inventory-dashboard
npm install
cp .env.example .env
```

### Step 2: Environment Configuration

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://username:password@your-neon-host/inventory_db?sslmode=require"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

### Step 3: Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database with sample data
npm run prisma:seed
```

### Step 4: Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run database migrations
npm run prisma:seed      # Seed database
npm run prisma:studio    # Open Prisma Studio
```

## 🏗️ Architecture

### State Management Architecture

**Redux Toolkit Slices:**
- **productSlice**: Manages product state, filters, pagination
- **orderSlice**: Manages order state, filters, sorting

**Async Thunks:**
- Centralized API call handling
- Automatic loading/error states
- Type-safe actions and reducers

**Selectors:**
- Memoized derived state using Reselect
- Computed values for filtered/paginated data
- Performance optimization

### Component Architecture

**Smart Components (Containers):**
- Connected to Redux store
- Handle data fetching and state updates
- Located in `app/` directory

**Presentational Components:**
- Pure, reusable UI components
- Receive data via props
- No direct store access
- Located in `components/` directory

**Component Hierarchy:**
```
App
├── Layout (Navbar + Sidebar)
├── Dashboard
│   ├── StatCards
│   └── Charts
├── ProductsPage
│   ├── ProductFilters
│   ├── ProductCard (reusable)
│   └── Pagination
├── ProductDetailPage
│   └── ProductForm (TanStack Form)
└── OrdersPage
    ├── OrderFilters
    ├── OrderTable (Material UI DataGrid)
    └── OrderStatusBadge (reusable)
```

### API Integration Strategy

**RESTful API Routes:**
- `GET /api/products` - List all products
- `GET /api/products/[id]` - Get product details
- `PATCH /api/products/[id]` - Update product
- `GET /api/orders` - List all orders
- `PATCH /api/orders/[id]` - Update order status

**Service Layer:**
- Abstracted API calls in service files
- Consistent error handling
- Type-safe request/response handling

**Caching Strategy:**
- Server-side caching with Next.js
- Client-side caching in Redux store
- Cache invalidation on mutations

### Database Schema Design

**Products Table:**
```prisma
model Product {
  id          Int      @id @default(autoincrement())
  name        String
  description String?
  category    String
  price       Float
  stock       Int      @default(0)
  rating      Float    @default(0)
  image       String?
  active      Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

**Orders Table:**
```prisma
model Order {
  id           Int         @id @default(autoincrement())
  orderId      String      @unique
  customerName String
  status       OrderStatus @default(PENDING)
  total        Float
  items        OrderItem[]
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt
}
```

**Relationships:**
- One-to-Many: Order → OrderItems
- Many-to-One: OrderItem → Product

### UI/UX Decisions

**Design System:**
- Material UI for consistent component styling
- Tailwind CSS for utility classes
- Dark/Light theme support

**User Experience:**
- Optimistic updates for instant feedback
- Loading states with skeletons
- Toast notifications for actions
- Smooth page transitions
- Mobile-first responsive design

**Performance Optimizations:**
- Client-side pagination (9 items per page)
- Memoized selectors to prevent re-renders
- Image optimization with Next.js Image
- Code splitting with dynamic imports

## 🧪 Testing the Application

### Manual Testing Checklist

**Product Management:**
- [ ] Filter products by name, category, and price
- [ ] Navigate through product pages
- [ ] View product details
- [ ] Update product stock quantity
- [ ] Toggle product active/inactive status
- [ ] Verify real-time updates in product list

**Order Management:**
- [ ] View all orders in DataGrid
- [ ] Sort orders by ID, total, and date
- [ ] Filter orders by status
- [ ] View order details with product items
- [ ] Verify status badge colors

**Dashboard:**
- [ ] Check statistics accuracy
- [ ] Verify order distribution chart
- [ ] Confirm category breakdown

## 🚢 Deployment

### Vercel Deployment (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables on Vercel
Add these in Vercel dashboard:
- `DATABASE_URL`
- `NEXT_PUBLIC_API_URL`

### Build Command
```bash
npm run build
```

## 📊 Performance Metrics

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Lighthouse Score**: 90+
- **Bundle Size**: < 250KB (gzipped)

## 🔒 Security Considerations

- Environment variables for sensitive data
- SQL injection prevention with Prisma
- Input validation with Zod
- HTTPS in production
- Rate limiting on API routes (recommended)

## 🐛 Known Issues & Future Enhancements

**Current Limitations:**
- No authentication/authorization
- No file upload for product images
- No batch operations

**Planned Features:**
- [ ] User authentication (NextAuth.js)
- [ ] Role-based access control
- [ ] Excel export functionality
- [ ] Advanced analytics dashboard
- [ ] Email notifications
- [ ] Product image upload
- [ ] Bulk product import

## 📝 Development Notes

### Code Quality Standards
- TypeScript strict mode enabled
- ESLint for code consistency
- Prettier for formatting
- Conventional commit messages

### Git Workflow
```bash
# Feature branch
git checkout -b feature/product-filters

# Commits
git commit -m "feat: add price range filter"
git commit -m "fix: pagination reset on filter change"

# Push
git push origin feature/product-filters
```

## 📞 Support

For issues or questions:
- Create an issue on GitHub
- Email: najathi777@gmail.com

## 📄 License

MIT License - feel free to use this project for learning and commercial purposes.

---

## 🎯 Assessment Completion Checklist

### Functional Requirements
- Product list with Material UI DataGrid
- Search by product name
- Filter by category (dropdown)
- Price range filter (slider)
- Client-side pagination
- Product details page
- Update stock quantity
- Mark product active/inactive
- Form handling with TanStack Form
- API PUT/PATCH requests
- Order list with sorting and filtering
- Status badges with colors
- Redux Toolkit slices
- Async Thunks for API calls
- Selectors for derived state

### UI/UX Requirements
- Material UI layout
- Top navigation bar
- Left sidebar
- Dark/Light mode toggle
- Reusable components (ProductCard, OrderStatusBadge, FilterPanel, ConfirmationDialog)

### Technical Requirements
- Redux Toolkit state management
- Proper folder structure
- Component breakdown
- Separation of concerns
- Reusability & scalability
- Error handling with toast
- TypeScript throughout

### Submission Requirements
- Well-documented README.md
- Architecture document
- State management explanation
- Component architecture overview
- API integration strategy
- UI/UX decisions documented

**Project Status: Ready for Submission**

Built using Next.js 16, Redux Toolkit, Prisma, and Material UI