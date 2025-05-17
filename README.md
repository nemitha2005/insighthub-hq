# 🔮 InsightHub - AI-Powered Business Intelligence Platform

<div align="center">
  <img src="[https://i.postimg.cc/rsk12HJW/logo.png]" alt="InsightHub Logo" width="200"/>
  
  [![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
  [![Next.js](https://img.shields.io/badge/Next.js-15.3.2-black)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19.1.0-blue)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)](https://www.typescriptlang.org/)
  [![Deploy](https://img.shields.io/badge/Deploy-Vercel-black)](https://insighthub-hq.vercel.app/)
</div>

InsightHub transforms how businesses analyze data by providing AI-powered insights, natural language querying, and automated visualization generation. Turn your business data into actionable intelligence with ease.

## 🌟 Key Features

### 🤖 AI-Powered Analytics

- **Natural Language Querying**: Ask questions about your data in plain English
- **Conversational AI Chat**: Interactive data analysis with AI assistant
- **Automated Chart Generation**: Describe visualizations and AI creates them instantly
- **Smart Insights**: AI discovers patterns and trends in your data

### 📊 Advanced Visualization

- Interactive charts and graphs (Bar, Line, Pie)
- Real-time data processing
- Customizable dashboards
- Export capabilities for reports

### 🔒 Enterprise-Grade Security

- Authentication with Firebase Auth
- Google OAuth integration
- Secure data encryption
- User data ownership and control

### 📱 Modern User Experience

- Responsive design for all devices
- Dark/Light theme support
- Intuitive interface
- Real-time updates

## 🚀 Live Demo

**🌐 [Try InsightHub Live](https://insighthub-hq.vercel.app/)**

Experience the power of AI-driven business intelligence firsthand!

## 📸 Screenshots

### Landing Page

<img src="https://link-to-landing-page-screenshot.png" alt="InsightHub Landing Page" width="800"/>

_Modern landing page showcasing AI-powered features_

### Dashboard Overview

<img src="https://link-to-dashboard-screenshot.png" alt="Dashboard Overview" width="800"/>

_Comprehensive dashboard with file management and AI features_

### AI Chat Interface

<img src="https://link-to-ai-chat-screenshot.png" alt="AI Chat Interface" width="800"/>

_Conversational AI that understands your business data_

### Data Visualization

<img src="https://link-to-visualization-screenshot.png" alt="Data Visualization" width="800"/>

_AI-generated charts and interactive visualizations_

### File Upload & Management

<img src="https://link-to-file-upload-screenshot.png" alt="File Upload" width="800"/>

_Seamless data upload with drag-and-drop functionality_

### Data Analysis Page

<img src="https://link-to-analysis-page-screenshot.png" alt="Data Analysis" width="800"/>

_Comprehensive data analysis with multiple view modes_

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 15.3.2
- **Language**: TypeScript 5.8.3
- **Styling**: Tailwind CSS 4.1.5
- **UI Components**: Radix UI + shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React

### Backend & Services

- **Authentication**: Firebase Auth
- **Database**: Firestore
- **File Storage**: Firebase Storage
- **AI**: Google Gemini API
- **Data Processing**: Papa Parse, SheetJS

### Development Tools

- **Linting**: ESLint
- **Formatting**: Prettier
- **Package Manager**: pnpm
- **Deployment**: Vercel

## 🏃‍♂️ Quick Start

### Prerequisites

- Node.js 20 or higher
- pnpm package manager
- Firebase project
- Google Gemini API key

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/nemitha2005/insighthub-hq.git
   cd insighthub-hq
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.local.example .env.local
   ```

   Fill in your environment variables:

   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id

   # Google Gemini API
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Configure Firebase**

   - Create a Firebase project
   - Enable Authentication (Email/Password and Google)
   - Set up Firestore database
   - Configure Firebase Storage
   - Update Firebase security rules

5. **Run the development server**

   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Firebase Setup

1. **Authentication Rules**

   - Enable Email/Password authentication
   - Enable Google sign-in provider

2. **Firestore Rules**

   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       match /files/{fileId} {
         allow read, write: if request.auth != null &&
           request.auth.uid == resource.data.userId;
       }
     }
   }
   ```

3. **Storage Rules**
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /users/{userId}/{allPaths=**} {
         allow read, write: if request.auth != null &&
           request.auth.uid == userId;
       }
     }
   }
   ```

### Google Gemini API Setup

1. Visit [Google AI Studio](https://makersuite.google.com/)
2. Create a new API key
3. Add the key to your environment variables

## 📦 Available Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server

# Code Quality
pnpm lint         # Run ESLint
pnpm lint:fix     # Fix ESLint issues
pnpm prettier     # Format code with Prettier
pnpm test         # Run all tests

# Deployment
pnpm deploy       # Deploy to Vercel
```

## 📁 Project Structure

```
insighthub-hq/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── dashboard/       # Dashboard-related pages
│   │   ├── login/          # Authentication pages
│   │   └── signup/
│   ├── components/          # Reusable components
│   │   ├── ui/             # Base UI components
│   │   ├── dashboard/      # Dashboard-specific components
│   │   ├── authentication/ # Auth-related components
│   │   └── home/           # Landing page components
│   ├── contexts/           # React Context providers
│   ├── lib/               # Utility libraries
│   ├── services/          # API and service integrations
│   ├── styles/            # CSS and styling files
│   └── utils/             # Helper functions
├── public/                 # Static assets
├── firebase.json          # Firebase configuration
└── package.json
```

## 🌟 Usage Examples

### Upload and Analyze Data

1. **Upload your data file**

   - Drag and drop CSV or Excel files
   - Files are securely stored in Firebase

2. **Start analyzing with AI**

   ```
   User: "What's the average sales by month?"
   AI: "Based on your data, here are the average sales by month..."
   ```

3. **Generate visualizations**
   ```
   User: "Show me a bar chart of revenue by region"
   AI: "I'll create a bar chart showing revenue by region for you."
   ```

### Natural Language Queries

- "Show me sales trends over time"
- "What's the most profitable product category?"
- "Compare Q1 and Q2 performance"
- "Create a pie chart of customer segments"

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support & Contact

- **Email**: [nemithan05@gmail.com](mailto:nemithan05@gmail.com)
- **Website**: [https://www.nemithawijerathna.online](https://www.nemithawijerathna.online)
- **Issues**: [GitHub Issues](https://github.com/nemitha2005/insighthub-hq/issues)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Firebase](https://firebase.google.com/) for backend services
- [Google Gemini](https://gemini.google.com/) for AI capabilities
- [Vercel](https://vercel.com/) for seamless deployment
- [shadcn/ui](https://ui.shadcn.com/) for beautiful components

---

<div align="center">
  <p>Made with ❤️ by <a href="https://www.nemithawijerathna.online">Nemitha Wijerathna</a></p>
  <p>⭐ Star this repo if you found it helpful!</p>
</div>
