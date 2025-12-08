# Follow.ai

<div align="center">
  <h3>Where AI Tools Show Their Real Work</h3>
  <p>The world's first AI tool review platform where real work outputs are mandatory.</p>
</div>

## 🎯 Project Overview

Follow.ai is a unique AI tool review platform that requires users to submit actual work outputs (code, images, videos, documents) with their reviews. This ensures authenticity and helps users make informed decisions about AI tools.

### Key Features

- ✅ **Mandatory Work Output**: No review without real work proof
- 💰 **Earn Money**: Get paid $20-200 per verified review
- 🏆 **Verified Rankings**: Tools ranked by real output quality
- 🤖 **AI Quality Analysis**: Automated analysis of submitted work
- 📰 **AI News Feed**: Latest updates from the AI tools ecosystem
- 🎖️ **Achievement System**: Gamified rewards for active users

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd follow.ai
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
VITE_STRIPE_PAYMENT_LINK_URL=your_stripe_payment_link
VITE_STRIPE_CONNECT_ONBOARD_URL=your_stripe_connect_url
GEMINI_API_KEY=your_gemini_api_key (optional, for future AI features)
```

4. Run the development server:
```bash
npm run dev
```

5. Open your browser:
Navigate to `http://localhost:3000`

## 📁 Project Structure

```
follow.ai/
├── components/          # Reusable React components
│   ├── AchievementNotification.tsx
│   ├── ActivityFeed.tsx
│   ├── ErrorBoundary.tsx
│   ├── Hero.tsx
│   ├── Navbar.tsx
│   ├── NewsWidget.tsx
│   ├── Rankings.tsx
│   ├── ReviewCard.tsx
│   ├── SocialShareModal.tsx
│   └── Tooltip.tsx
├── pages/               # Page components
│   ├── About.tsx
│   ├── Home.tsx
│   ├── NewsPage.tsx
│   ├── Payments.tsx
│   ├── Profile.tsx
│   ├── RankingsPage.tsx
│   ├── SubmitReview.tsx
│   ├── Tasks.tsx
│   ├── Terms.tsx
│   └── ToolDetail.tsx
├── data.ts              # Mock data
├── types.ts             # TypeScript type definitions
├── App.tsx              # Main app component with routing
├── index.tsx            # Entry point
└── index.html           # HTML template
```

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.2.1
- **Routing**: React Router DOM 7.10.1
- **Build Tool**: Vite 6.2.0
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Language**: TypeScript
- **Deployment**: Vercel (recommended)

## 📄 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🌐 Pages

- `/` - Homepage with rankings, reviews, and categories
- `/submit` - Submit a review with work output
- `/tasks` - Browse paid testing tasks
- `/rankings` - Full rankings page with filters
- `/news` - AI tools news and updates
- `/tool/:id` - Individual tool detail page
- `/profile` - User profile page
- `/payments` - Payment setup (Stripe)
- `/about` - About page
- `/terms` - Terms of service

## 🎨 Key Features Explained

### 1. AI Output Quality Analyzer
When users submit work outputs, the system analyzes:
- Complexity score
- Originality percentage
- Metadata verification
- Overall quality score (0-10)

### 2. Achievement System
Users unlock achievements for:
- First review submission
- High-quality reviews
- Consistent contributions
- Community engagement

### 3. Use Cases Tags
Each tool displays its use cases (e.g., "Coding", "Analysis", "Writing") to help users quickly understand what the tool is best for.

## 🔧 Configuration

### Stripe Integration (Payments)

1. Create a Stripe account
2. Set up Payment Links for receiving payments
3. Configure Stripe Connect for payouts to testers
4. Add the links to your `.env` file

See `pages/Payments.tsx` for more details.

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1920px+)
- Tablet (768px - 1024px)
- Mobile (320px - 767px)

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

The app will automatically deploy on every push to main.

### Other Platforms

The app can be deployed to any platform that supports Vite:
- Netlify
- Cloudflare Pages
- AWS Amplify
- etc.

## 📝 Development Notes

- Uses HashRouter for client-side routing (works with static hosting)
- All data is currently mocked in `data.ts` - replace with real API calls
- AI analysis is simulated - integrate with Gemini API for real analysis
- Error boundary catches and displays React errors gracefully

## 🔮 Future Enhancements

- [ ] Real backend API integration
- [ ] User authentication (Firebase Auth / Auth0)
- [ ] Real file upload and storage
- [ ] Gemini API integration for quality analysis
- [ ] Search functionality
- [ ] Comment replies and discussions
- [ ] Recruitment features (open to work, portfolios)
- [ ] Subscription model (after 5000+ reviews)

## 📄 License

All rights reserved © 2025 Follow.ai

## 🤝 Contributing

This is currently a private project. For inquiries, contact: hello@follow.ai

## 📧 Contact

- Email: hello@follow.ai
- Website: https://follow.ai

---

Built with ❤️ in Melbourne, Australia
