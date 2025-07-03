# Skylism

**The realism your skies deserve.**

A professional web application for photographers and real estate agents to enhance images with AI-powered sky replacement and automatic decluttering.

## Features

- 🌤️ **Sky Replacement**: Perfect blue skies, golden sunsets, moody overcast
- 🧹 **Auto Decluttering**: Remove unwanted objects and clutter
- ⚡ **Lightning Fast**: 4 AI variations in seconds
- 💳 **Pay-as-you-go**: Credit-based pricing, no subscriptions
- 🎯 **Professional Results**: Powered by Flux Dev and ESRGAN

## Setup Instructions

### 1. Environment Variables

Copy `.env.local` and update with your actual credentials:

```env
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Replicate (Required for AI)
REPLICATE_API_TOKEN=your-replicate-token

# Stripe (Required for payments)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# App Config
NEXT_PUBLIC_CREDIT_PRICE=0.4
API_MARKUP=1.7
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Supabase Setup

1. Create a new Supabase project
2. Run the SQL commands in `supabase-schema.sql` in your Supabase SQL editor
3. Enable Google OAuth in Authentication > Providers (optional)

### 3. Stripe Setup

1. Create Stripe account and get API keys
2. Set up webhook endpoint for `/api/webhooks/stripe`
3. Configure webhook to listen for `checkout.session.completed`

### 4. Replicate Setup

1. Create Replicate account
2. Get API token from dashboard
3. The app uses Flux Dev (cheap) and ESRGAN models

### 5. Run Development Server

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`

## Deployment

### Vercel (Recommended)

1. Connect GitHub repository to Vercel
2. Add all environment variables in Vercel dashboard
3. Deploy!

### Manual Deployment

```bash
npm run build
npm run start
```

## Usage

1. **Sign up** - Get 3 free credits
2. **Upload images** - Drag and drop up to 20 images
3. **Choose preset** - Perfect Blue Sky, Sunset, Remove Clutter, Fix Lighting
4. **Generate** - Get 4 AI variations (1 credit per image)
5. **Select & Upscale** - Choose favorite and upscale to high-res
6. **Download** - Get professional results

## Pricing

- **1 credit = $0.40**
- **1 credit = 1 image edit + 4 variations + upscaling**
- **Credit packages**: 10 ($7.99), 25 ($17.99), 50 ($31.99)

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **AI**: Replicate (Flux Dev + ESRGAN)
- **Payments**: Stripe
- **Hosting**: Vercel

## Development Timeline

Built in 4 days (July 3-7, 2025) as a complete MVP.

## License

Private project. All rights reserved.
