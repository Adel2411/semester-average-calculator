<div align="center">
  <img src="public/logo.png" alt="Semester Average Calculator Logo" width="200" height="200" />
</div>

# Semester Average Calculator

A modern, feature-rich web application for calculating weighted semester averages with advanced template management, data export capabilities, and URL sharing functionality.

[![Next.js](https://img.shields.io/badge/Next.js-15.3.2-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-blue)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.7-38B2AC)](https://tailwindcss.com/)
[![Zod](https://img.shields.io/badge/Zod-3.24.1-green)](https://zod.dev/)

## 🚀 Live Demo

Visit the live application: [https://semester-average-calculator.vercel.app](https://semester-average-calculator.vercel.app)

## ✨ Features

### 📊 Core Functionality
- **Weighted Average Calculation**: Calculate semester averages using coefficient-based weighting
- **Dynamic Module Management**: Add, remove, and modify modules on-the-fly
- **Real-time Validation**: Input validation with immediate feedback using Zod schemas
- **Pass/Fail Status**: Automatic determination based on configurable thresholds (default: 10/20)

### 💾 Template System
- **Save Templates**: Create reusable templates with module names, coefficients, and scores
- **Template Manager**: Full CRUD operations for saved templates
- **Quick Template Selection**: Easy template application with one-click loading
- **Template Editing**: Modify existing templates without losing data

### 📤 Export & Sharing
- **CSV Export**: Download results in CSV format for spreadsheet analysis
- **PDF Export**: Generate professional PDF reports with formatted tables
- **URL Sharing**: Share calculations via compressed URLs with automatic data restoration
- **Multiple Compression Formats**: Base64 and LZ-String compression for optimal URL length

### 🎨 User Experience
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Form Persistence**: Automatic URL updates to prevent data loss
- **Modern UI**: Clean, intuitive interface with Radix UI components
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation

## 🛠️ Technology Stack

### Frontend Framework
- **Next.js 15.3.2** - React framework with App Router
- **React 19.0** - Latest React with concurrent features
- **TypeScript 5** - Type-safe development

### Styling & UI
- **Tailwind CSS 4.1.7** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful SVG icons
- **CSS Variables** - Custom theme implementation

### Data Management
- **Zod 3.24.1** - Schema validation and type inference
- **React Hook Form** - Performant form handling
- **Local Storage** - Client-side template persistence

### Export & Compression
- **@react-pdf/renderer** - PDF generation
- **LZ-String** - Advanced string compression
- **Base64** - Standard data encoding

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles and CSS variables
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Main application page
├── components/            # React components
│   ├── ui/               # Base UI components (Radix UI)
│   ├── AverageForm.tsx   # Main calculation form
│   ├── ResultCard.tsx    # Results display
│   ├── ResultView.tsx    # Detailed results with actions
│   ├── ResultsPDF.tsx    # PDF generation component
│   ├── TemplateManager.tsx        # Template CRUD operations
│   ├── SaveTemplateDialog.tsx     # Template creation dialog
│   └── EditTemplateDataDialog.tsx # Template editing dialog
├── hooks/                 # Custom React hooks
│   └── useAverageCalculator.ts    # Average calculation logic
└── lib/                   # Utility libraries
    ├── schemas.ts         # Zod validation schemas
    ├── templateStorage.ts # Template persistence logic
    ├── urlUtils.ts        # URL compression and sharing
    ├── csvUtils.ts        # Export functionality
    └── utils.ts           # General utilities
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18.17 or later
- npm, yarn, or pnpm package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Adel2411/semester-average-calculator.git
   cd semester-average-calculator
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
# Build the application
npm run build

# Start the production server
npm run start
```

## 📖 Usage Guide

### Basic Calculation
1. Enter module names, coefficients, and scores
2. Click "Calculate Average" to see results
3. View pass/fail status and detailed breakdown

### Using Templates
1. **Save Template**: After entering modules, click "Save Template"
2. **Load Template**: Use the template selector to load saved configurations
3. **Manage Templates**: Click "Templates" to edit, delete, or organize templates

### Exporting Results
- **CSV**: Download spreadsheet-compatible data
- **PDF**: Generate formatted academic reports
- **Share URL**: Copy shareable link with embedded data

### URL Sharing
The application automatically compresses form data into URLs:
- **Legacy format**: Standard URL parameters
- **Base64 format**: Compressed JSON data
- **LZ-String format**: Maximum compression for large datasets

## 🔧 Configuration

### Validation Rules
- **Module Names**: Required, non-empty strings
- **Coefficients**: Positive integers (minimum 1)
- **Scores**: Numbers between 0 and 20 (French grading system)

### Customization
- Modify passing threshold in `ResultCard.tsx`
- Update validation rules in `src/lib/schemas.ts`
- Customize PDF styling in `ResultsPDF.tsx`
- Adjust compression algorithms in `urlUtils.ts`

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript strict mode
- Use meaningful commit messages
- Add tests for new features
- Ensure responsive design
- Maintain accessibility standards

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Adel Harrat**
- GitHub: [@Adel2411](https://github.com/Adel2411)
- Project: [semester-average-calculator](https://github.com/Adel2411/semester-average-calculator)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Radix UI](https://www.radix-ui.com/) for accessible components
- [Zod](https://zod.dev/) for runtime type validation
- [React Hook Form](https://react-hook-form.com/) for form management

## 📊 Features Overview

| Feature | Description | Status |
|---------|-------------|--------|
| ✅ Weighted Calculations | Coefficient-based average calculation | ✅ Complete |
| ✅ Template System | Save and reuse module configurations | ✅ Complete |
| ✅ Export Options | CSV and PDF export functionality | ✅ Complete |
| ✅ URL Sharing | Compressed data sharing via URLs | ✅ Complete |
| ✅ Responsive Design | Mobile-first responsive layout | ✅ Complete |
| ✅ Form Validation | Real-time input validation | ✅ Complete |
| ✅ Data Persistence | Local storage for templates | ✅ Complete |
| ✅ Accessibility | WCAG compliant interface | ✅ Complete |

---

<div align="center">
  <p>Built with ❤️ for students and educators worldwide</p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>