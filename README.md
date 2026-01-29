# Smart Contract Vulnerability Detector - Frontend

Modern, responsive Next.js frontend for the Smart Contract Vulnerability Detector API. Built with TypeScript, Tailwind CSS, and React components.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Backend API running on `http://localhost:8000`

### Installation & Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Access the Application
- **Frontend URL:** http://localhost:3000
- **Backend API:** http://localhost:8000 (must be running)

## 🎯 Features

### Core Functionality
- **Contract Analysis** - Analyze complete Solidity contracts for vulnerabilities
- **Function Analysis** - Test individual functions for security issues
- **Real-time Results** - Interactive analysis with detailed vulnerability reports
- **Model Selection** - Choose between different AI models (Auto, Ensemble, CodeBERT, LSTM, CNN)

### User Interface
- **Modern Design** - Clean, professional interface with Tailwind CSS
- **Responsive Layout** - Works perfectly on desktop and mobile devices
- **Code Highlighting** - Syntax-highlighted Solidity code with line numbers
- **Interactive Results** - Expandable function details with vulnerability breakdowns
- **Sample Contracts** - Pre-loaded vulnerable and safe contract examples

### Analysis Features
- **Vulnerability Detection** - Identifies 7 types of smart contract vulnerabilities
- **Risk Assessment** - HIGH/MEDIUM/LOW risk categorization
- **Confidence Scores** - AI confidence levels for each prediction
- **Detailed Recommendations** - Specific fix suggestions for detected issues
- **Performance Metrics** - Model accuracy, precision, recall, and F1 scores

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                 # Next.js app router
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Home page
│   ├── components/         # React components
│   │   ├── AnalysisResults.tsx
│   │   ├── CodeAnalyzer.tsx
│   │   ├── ModelSelector.tsx
│   │   └── VulnerabilityDashboard.tsx
│   ├── services/           # API services
│   │   └── api.ts
│   ├── types/             # TypeScript types
│   │   └── api.ts
│   └── utils/             # Utilities
│       ├── helpers.ts
│       └── sampleContracts.ts
├── package.json           # Dependencies
├── tailwind.config.js     # Tailwind configuration
├── tsconfig.json         # TypeScript configuration
└── next.config.js        # Next.js configuration
```

## 🔧 Configuration

### Environment Variables
Create `.env.local` for custom backend URL:
```bash
BACKEND_URL=http://localhost:8000
```

### Backend Connection
The frontend automatically connects to the backend API. Ensure:
1. Backend server is running (`./run_backend.sh`)
2. Models are trained and loaded
3. CORS is properly configured (already handled)

## 🎨 Components Overview

### CodeAnalyzer
- Main analysis interface
- Supports both contract and function analysis
- Model selection and sample loading
- Real-time result display

### AnalysisResults
- Comprehensive result visualization
- Function-by-function breakdown
- Vulnerability details with recommendations
- Performance metrics and confidence scores

### ModelSelector
- Displays available AI models
- Performance metrics comparison
- Model availability status
- Automatic best model selection

### VulnerabilityDashboard
- Lists all supported vulnerability types
- Severity levels and descriptions
- Interactive vulnerability exploration

## 🛠️ Development

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Code Style
- TypeScript for type safety
- Tailwind CSS for styling
- ESLint for code quality
- Consistent component patterns

### Adding New Features
1. Create components in `src/components/`
2. Add types in `src/types/`
3. Update API service in `src/services/api.ts`
4. Follow existing patterns for consistency

## 🔍 API Integration

### Endpoints Used
- `GET /health` - Backend status
- `GET /models` - Available models
- `GET /vulnerabilities` - Vulnerability types
- `POST /analyze` - Contract analysis
- `POST /analyze-function` - Function analysis

### Error Handling
- Network errors with retry logic
- User-friendly error messages
- Graceful fallbacks for offline scenarios

## 🎯 Usage Guide

### Analyzing a Contract
1. Select "Contract" mode
2. Enter contract name (optional)
3. Paste Solidity contract code
4. Choose model (or use Auto)
5. Click "Analyze Contract"
6. Review detailed results

### Analyzing a Function
1. Select "Function" mode
2. Paste function code
3. Choose model (or use Auto)
4. Click "Analyze Function"
5. Review vulnerability assessment

### Using Sample Code
- Click any sample contract/function name
- Code loads automatically
- Perfect for testing and learning

## 🚨 Troubleshooting

### Common Issues

**Frontend won't start:**
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Backend connection failed:**
- Ensure backend is running on port 8000
- Check `./run_backend.sh` in parent directory
- Verify no firewall blocking connections

**Models not loaded:**
- Train models using provided notebooks
- Check backend logs for model loading errors
- Ensure model files exist in `models/` directory

**Analysis fails:**
- Validate Solidity syntax
- Check for unsupported language features
- Ensure code is complete and compilable

## 📱 Mobile Support

Fully responsive design optimized for:
- Desktop (1200px+)
- Tablet (768px-1199px)
- Mobile (320px-767px)

## 🔒 Security Notes

- All API calls use proper error handling
- No sensitive data stored in frontend
- HTTPS recommended for production
- Input validation on both frontend and backend

---

**Need Help?** Check the main project README or backend documentation for additional setup instructions.

## Getting Started

To get started with the frontend development:

```bash
npm install
npm start
```

## Features

- Smart contract analysis
- Vulnerability detection visualization
- Real-time feedback on code analysis

## Contributing

For contribution guidelines, please refer to the main project repository.

## License

This project is part of the Smart Contract Vulnerability Detector project.
