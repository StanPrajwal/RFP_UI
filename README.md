# 🤖 AI-Powered RFP Management System

A modern, AI-powered Request for Proposal (RFP) management application built with React, TypeScript, and Ant Design. This application streamlines the procurement process by allowing users to generate structured RFPs from natural language descriptions, manage vendors, compare proposals, and make data-driven procurement decisions.

## ✨ Features

- **AI-Powered RFP Generation**: Convert natural language procurement descriptions into structured RFPs
- **RFP Management**: Create, view, and manage multiple RFPs in one place
- **Vendor Management**: Assign vendors to RFPs and send invitations
- **Proposal Comparison**: AI-powered comparison of vendor proposals with scoring and recommendations
- **Modern UI/UX**: Clean, professional interface built with Ant Design
- **Real-time Updates**: React Query for efficient data fetching and caching
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.2.0
- **Language**: TypeScript 5.9.3
- **Build Tool**: Vite 5.1.6
- **UI Library**: Ant Design 6.0.1
- **State Management**: TanStack React Query 5.90.12
- **HTTP Client**: Axios 1.13.2
- **Routing**: React Router DOM 6.26.2

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.x or higher (Node.js 18.19.0+ recommended)
- **npm**: Version 9.x or higher (comes with Node.js)
- **Backend API**: The application requires a backend API running on `http://localhost:8080` (or configure a different URL)

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/StanPrajwal/RFP_UI
cd RFP_UI
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required dependencies listed in `package.json`.

### Step 3: Configure Environment Variables (Optional)

Create a `.env` file in the root directory if you need to customize the API base URL:

```env
VITE_API_BASE_URL=http://localhost:8080
```

**Note**: If no `.env` file is provided, the application defaults to `http://localhost:8080`.

## ⚙️ Configuration

### API Configuration

The API base URL is configured in `src/config/axios.ts`. You can modify it in two ways:

1. **Environment Variable**: Set `VITE_API_BASE_URL` in your `.env` file
2. **Default**: The application defaults to `http://localhost:8080`

### Authentication

The application supports Bearer token authentication. Tokens are stored in `localStorage` under the key `authToken`. The Axios interceptor automatically adds the token to all requests.

## 🏃 Running the Application

### Development Mode

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the next available port).

### Build for Production

Create an optimized production build:

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

### Linting

Run ESLint to check for code issues:

```bash
npm run lint
```

## 📁 Project Structure

```
ai-chat-app/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images and other assets
│   ├── components/        # React components
│   │   ├── ChatWindow.tsx      # Chat interface for RFP generation
│   │   ├── RfpDetail.tsx       # RFP detail page with vendor management
│   │   ├── RfpList.tsx         # List of all RFPs
│   │   ├── RfpModal.tsx        # Modal for displaying generated RFP
│   │   └── ProductCards.tsx    # Product display component (legacy)
│   ├── config/            # Configuration files
│   │   ├── axios.ts            # Axios instance with interceptors
│   │   └── queryClient.ts      # React Query client configuration
│   ├── services/          # API services
│   │   └── api.ts              # API functions and React Query hooks
│   ├── App.tsx            # Main application component with routing
│   ├── App.css            # Global styles
│   ├── index.css          # Base styles
│   └── main.tsx           # Application entry point
├── .env                   # Environment variables (create if needed)
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite configuration
└── README.md              # This file
```

## 🔌 API Endpoints

The application integrates with the following backend API endpoints:

### RFP Management
- `POST /rfp/generate-rfp` - Generate structured RFP from natural language
- `POST /rfp/create` - Save a new RFP
- `GET /rfp/fetch-all-rfp` - Fetch all RFPs
- `POST /rfp/:id/vendors` - Assign vendors to an RFP
- `POST /rfp/:id/send` - Send RFP to vendors

### Vendor Management
- `GET /vendor/fetch-vendors` - Fetch all available vendors

### Proposal Management
- `GET /rfp/:id/proposals` - Fetch vendor proposals for an RFP
- `GET /rfp/:id/compare` - Get AI-powered proposal comparison

For detailed API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

## 🎯 Usage Guide

### Creating a New RFP

1. Navigate to the home page (`/`)
2. Click on "Create RFP" in the header navigation
3. Enter your procurement requirements in natural language (e.g., "I need 25 desktop computers and 10 projectors...")
4. Click "Generate RFP" or press Enter
5. Review the generated RFP in the modal popup
6. Click "Save RFP" to save it

### Managing RFPs

1. View all RFPs on the home page (`/`)
2. Click on any RFP card to view details
3. On the RFP detail page, you can:
   - View RFP information and items
   - Assign vendors
   - Send RFP invitations
   - View vendor proposals
   - Compare proposals with AI recommendations

### Example RFP Description

```
I need 25 desktop computers and 10 projectors for a training center. 
Budget is $40,000. Delivery in 45 days. Payment terms: net 45. 
Warranty: at least 2 years.
```

## 🐛 Troubleshooting

### Common Issues

#### 1. **Application won't start / Node.js version error**

**Error**: `TypeError: crypto.hash is not a function` or Node.js version warnings

**Solution**: Ensure you're using Node.js 18.x or higher. The project is configured for Node.js 18.19.0+.

```bash
node --version  # Should show v18.x.x or higher
```

#### 2. **API connection errors**

**Error**: Network errors or "Failed to fetch" messages

**Solution**: 
- Ensure the backend API is running on `http://localhost:8080`
- Check your `.env` file if you've customized the API URL
- Verify CORS settings on the backend

#### 3. **Port already in use**

**Error**: `Port 5173 is already in use`

**Solution**: Vite will automatically use the next available port, or you can specify a port:

```bash
npm run dev -- --port 3000
```

#### 4. **Build errors**

**Error**: TypeScript or build errors

**Solution**:
- Run `npm run lint` to check for code issues
- Ensure all dependencies are installed: `npm install`
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`

#### 5. **Blank screen after generating RFP**

**Solution**: This was fixed in the latest version. Ensure you're using the latest code with proper null handling for RFP fields.

## 🔧 Development Guidelines

### Code Style

- Use TypeScript for all new files
- Follow React best practices and hooks patterns
- Use functional components with hooks
- Maintain consistent naming conventions (PascalCase for components, camelCase for functions)

### Adding New Features

1. Create components in `src/components/`
2. Add API functions in `src/services/api.ts`
3. Use React Query hooks for data fetching
4. Follow the existing component structure and styling patterns

### Styling

- Use Ant Design components where possible
- Custom styles in `App.css` for component-specific styling
- Maintain consistent color scheme: Primary blue `#2563eb`
- Use Inter font family for typography

## 📝 Scripts Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🔐 Security Notes

- Authentication tokens are stored in `localStorage` (not recommended for production)
- For production, consider using secure HTTP-only cookies
- Always validate and sanitize user inputs
- Implement proper CORS policies on the backend

## 🤝 Contributing

1. Follow the existing code structure and patterns
2. Write clear commit messages
3. Test your changes thoroughly
4. Ensure TypeScript compilation passes: `npm run build`

## 📄 License

This project is private and proprietary.

## 📞 Support

For issues or questions:
- Check the [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for API details
- Review the troubleshooting section above
- Check browser console for error messages

## 🎉 Getting Started Checklist

- [ ] Node.js 18.x+ installed
- [ ] Dependencies installed (`npm install`)
- [ ] Backend API running on `http://localhost:8080`
- [ ] Development server started (`npm run dev`)
- [ ] Application accessible at `http://localhost:5173`

---

**Built with ❤️ using React, TypeScript, and Ant Design**
