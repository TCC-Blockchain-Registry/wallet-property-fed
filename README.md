# Wallet Property Fed

Web3 frontend application for property tokenization and management built with React, TypeScript, and blockchain integration.

## Overview

Wallet Property Fed is the user-facing web application for the property tokenization platform. It provides an intuitive interface for property owners, buyers, and approvers to interact with tokenized real estate assets on the blockchain.

The application integrates with MetaMask for Web3 wallet management and communicates with the BFF Gateway for all backend operations, ensuring a seamless user experience for blockchain-based property transactions.

## Tech Stack

- **Vite** - Build tool and development server
- **React 18** - UI framework
- **TypeScript** - Type-safe programming
- **shadcn-ui** - Component library (Radix UI primitives)
- **Tailwind CSS** - Utility-first CSS framework
- **Ethers.js 6** - Blockchain interaction library
- **React Router DOM** - Client-side routing
- **TanStack React Query** - Server state management
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Axios** - HTTP client
- **Lucide React** - Icon library

## Prerequisites

- Node.js 18+ (or compatible)
- npm or yarn
- MetaMask browser extension
- BFF Gateway running on port 4000
- Blockchain network configured in MetaMask (Network ID 1337, RPC http://localhost:8545)

## Quick Start

```bash
# Clone repository
git clone <repository-url>
cd wallet-property-fed

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
# Edit .env if needed (see Environment Variables section)

# Run development server
npm run dev
```

The application will be available at `http://localhost:5173`

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# BFF Gateway URL
VITE_API_URL=http://localhost:4000/api

# Optional: Direct blockchain RPC (for read-only operations)
# VITE_RPC_URL=http://localhost:8545
```

## Running Standalone

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Build for development (with source maps)
npm run build:dev

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Integration with Other Services

This frontend requires the following services to be running:

1. **BFF Gateway** (port 4000) - API aggregation layer
2. **Core Orchestrator** (port 8080) - Backend business logic
3. **Offchain API** (port 3000) - Blockchain integration
4. **Blockchain Network** (port 8545) - Hyperledger Besu node
5. **RabbitMQ** (port 5672) - Message queue
6. **Queue Worker** - Async job processor

**Important**: Configure MetaMask with the local Besu network:
- Network Name: Besu Local
- RPC URL: http://localhost:8545
- Chain ID: 1337
- Currency Symbol: ETH

## Key Features

- MetaMask wallet integration for Web3 authentication
- Property registration and management
- Multi-party approval workflow for transfers
- Property transfer execution
- Real-time blockchain transaction status
- Property search and filtering
- Dashboard with statistics
- Responsive design for mobile and desktop
- Dark mode support

## Project Structure

```
wallet-property-fed/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable React components
│   │   └── ui/         # shadcn-ui components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utilities and configurations
│   ├── services/       # API service layer
│   ├── types/          # TypeScript type definitions
│   ├── App.tsx         # Root component
│   └── main.tsx        # Application entry point
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## Health Check

Once the application is running, verify it's working:

1. Navigate to http://localhost:5173
2. You should see the landing page
3. Connect MetaMask wallet
4. Verify network is set to Besu Local (Chain ID 1337)
5. Check browser console for any errors

## Troubleshooting

### MetaMask Not Detected

**Problem**: Application shows "MetaMask not installed"

**Solution**:
- Install MetaMask browser extension
- Refresh the page after installation
- Ensure MetaMask is unlocked

### Wrong Network

**Problem**: MetaMask connected to wrong network

**Solution**:
1. Open MetaMask
2. Click network dropdown
3. Add custom network:
   - Network Name: Besu Local
   - RPC URL: http://localhost:8545
   - Chain ID: 1337
   - Currency Symbol: ETH

### API Connection Failed

**Problem**: Cannot connect to backend services

**Solution**:
- Verify BFF Gateway is running on port 4000
- Check `VITE_API_URL` in `.env` is correct
- Ensure CORS is configured in BFF Gateway
- Check browser console network tab for errors

### Build Errors

**Problem**: Build fails with TypeScript errors

**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### Port Already in Use

**Problem**: Port 5173 already in use

**Solution**:
```bash
# Find and kill process using port 5173
lsof -i :5173
kill -9 <PID>

# Or run on different port
npm run dev -- --port 5174
```

## Docker Deployment

```bash
# Build Docker image
docker build -t wallet-property-fed .

# Run container
docker run -p 80:80 \
  -e VITE_API_URL=http://your-bff-url:4000/api \
  wallet-property-fed
```

## Production Build

```bash
# Create optimized production build
npm run build

# Build output will be in dist/ directory
# Deploy dist/ to any static hosting service (Nginx, Vercel, Netlify, etc.)
```

## License

MIT
