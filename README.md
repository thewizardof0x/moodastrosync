# Horoscope Submission App

A web app that collects horoscope data (email, sign, mood) and sends it to Make.com webhooks.

## Deploy to Vercel (Free)

1. **Connect your GitHub repo to Vercel:**
   - Push this code to a GitHub repository
   - Go to vercel.com and import your GitHub repo

2. **Set environment variable:**
   - In Vercel dashboard, go to your project settings
   - Add environment variable: `MAKE_WEBHOOK_URL` with your webhook URL

3. **Deploy:**
   - Vercel will automatically build and deploy
   - Your app will be live at `yourapp.vercel.app`

## Local Development

```bash
npm install
npm run dev
```

The app runs on port 3000 with both frontend and backend.

## Tech Stack

- React + TypeScript frontend
- Express.js backend
- Make.com webhook integration
- Tailwind CSS + shadcn/ui components