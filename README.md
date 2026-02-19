This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!


## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

### Environment Variables
When deploying to Vercel, make sure to add the following Environment Variables in the Project Settings:

- `MONGODB_URI`: Your MongoDB Connection String (e.g., `mongodb+srv://user:pass@cluster...`)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe Public Key (starts with `pk_test_...` or `pk_live_...`)
- `STRIPE_SECRET_KEY`: Your Stripe Secret Key (starts with `sk_test_...` or `sk_live_...`)
- `GMAIL_USER`: Your Gmail address (e.g., `kamalkarthik88615@gmail.com`)
- `GMAIL_APP_PASSWORD`: Your Gmail App Password (16 characters, no spaces)
- `CONTACT_EMAIL`: The email where you want to receive order notifications (e.g., `kamalkarthik88615@gmail.com`)
- `NEXT_PUBLIC_BASE_URL`: The URL of your deployed site (e.g., `https://your-project.vercel.app`)

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
