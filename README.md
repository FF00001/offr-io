# Offr.io

Professional quote generation platform for craftsmen and contractors.

## Features

### Public Features
- **Landing Page**: Marketing page with call-to-action
- **Try it Now**: Generate quotes without account (public mode)
- **Feedback System**: Users can submit feedback via email

### Authentication
- **Sign Up**: Create Agent or Enterprise account
- **Log In**: Email/password authentication
- **Session Management**: Secure cookie-based sessions

### Agent Dashboard
- **Quotes History**: View all generated quotes
- **Generate Quote**: Create new professional quotes with AI
- **Download PDF**: Export quotes as PDF files
- **Delete Quotes**: Remove quotes with confirmation
- **Upload Catalog**: CSV file with products/services
- **Update Catalog**: Replace existing catalog

### Enterprise Dashboard
All Agent features plus:
- **Add Agents**: Invite agents via email
- **Team Management**: Enterprise agents can access enterprise catalog

## Tech Stack

- **Framework**: Next.js 16 + React 19
- **Language**: TypeScript
- **Styling**: TailwindCSS 4
- **PDF**: jsPDF
- **AI**: OpenAI GPT-4o-mini (with mock mode)
- **Email**: Resend API
- **Database**: File-based JSON (production: use PostgreSQL/Supabase)
- **Authentication**: Custom session-based auth

## Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your keys
```

### Environment Variables

```env
# OpenAI API (optional - mock mode works without it)
OPENAI_API_KEY=your_openai_api_key

# Resend API (for feedback emails)
RESEND_API_KEY=your_resend_api_key

# App URL (for invitation emails)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Development

```bash
# Run development server
npm run dev

# Open http://localhost:3000
```

### Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/          # Authentication endpoints
│   │   ├── quotes/        # Quote management
│   │   ├── catalogs/      # Catalog management
│   │   ├── invitations/   # Enterprise agent invitations
│   │   ├── feedback/      # Feedback submission
│   │   ├── generate-quote/# AI quote generation
│   │   └── generate-pdf/  # PDF export
│   ├── dashboard/         # Protected dashboard pages
│   │   ├── page.tsx       # Quotes history
│   │   ├── generate/      # Generate quote
│   │   ├── catalog/       # Catalog management
│   │   └── agents/        # Add agents (enterprise)
│   ├── signup/            # Sign up page
│   ├── login/             # Login page
│   ├── quote/             # Public quote page
│   ├── feedback/          # Feedback page
│   └── page.tsx           # Landing page
├── components/
│   ├── Header.tsx         # Main header
│   ├── QuoteForm.tsx      # Quote generation form
│   └── dashboard/
│       ├── DashboardLayout.tsx        # Dashboard sidebar layout
│       └── DashboardLayoutWrapper.tsx # Auth wrapper
├── lib/
│   ├── auth.ts            # Authentication helpers
│   ├── db.ts              # Database operations
│   ├── session.ts         # Session management
│   ├── openai.ts          # OpenAI integration
│   ├── pdf.ts             # PDF generation
│   └── mock-data.ts       # Mock data (USE_MOCK = true)
└── types/
    ├── quote.ts           # Quote types
    └── user.ts            # User types
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `RESEND_API_KEY`
   - `OPENAI_API_KEY` (optional)
   - `NEXT_PUBLIC_APP_URL`
4. Deploy

### Other Platforms

Build the project and deploy the `.next` folder with Node.js server.

## Features Roadmap

### Current (MVP)
- ✅ Authentication (Sign up / Login)
- ✅ Agent Dashboard
- ✅ Enterprise Dashboard
- ✅ Quote Generation (AI + Mock mode)
- ✅ PDF Export
- ✅ Catalog Management (CSV upload)
- ✅ Agent Invitations (Enterprise)
- ✅ Feedback System

### Future
- [ ] PostgreSQL/Supabase integration
- [ ] Stripe payment integration
- [ ] Multi-language support
- [ ] Quote templates
- [ ] Advanced analytics
- [ ] Real-time collaboration
- [ ] Mobile app

## Mock Mode

By default, the app uses mock data (no OpenAI API calls needed).

To disable mock mode:
1. Edit `src/lib/mock-data.ts`
2. Change `export const USE_MOCK = false`
3. Add your OpenAI API key to `.env.local`

## Database

Currently uses file-based JSON storage (`data/` folder).

For production, migrate to:
- PostgreSQL
- Supabase
- PlanetScale
- MongoDB

Update `src/lib/db.ts` with your database client.

## Contributing

This is an MVP. Contributions welcome!

## License

MIT

## Support

For questions or issues, use the feedback form in the app.
