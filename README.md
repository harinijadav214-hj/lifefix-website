# LifeFix — Complete Website Prototype

A responsive React + TypeScript website for the LifeFix everyday-task marketplace. This package keeps the existing project direction and includes signup/demo login, customer home, service categories, task drafts, helper search, booking-request preview, AI chat, helper dashboard, task board, earnings preview, profile editing and an owner/admin preview.

## Run on Windows

1. Extract this ZIP to a folder, for example `C:\LifeFix`.
2. Install Node.js LTS if `node --version` and `npm --version` do not work.
3. Open Command Prompt inside the extracted `LifeFix` folder.
4. Run `npm install` once. You do not need to repeat this unless dependencies change.
5. Open **two** Command Prompt windows in this same folder.

Window 1 — backend API:

```bash
npm run server
```

Window 2 — website:

```bash
npm run dev
```

Open the local address Vite prints, normally `http://localhost:5173`.

Next time, leave `npm install` alone and just start those two commands. Both windows must stay running for the local website and chat API to work.

## AI chat

The chat page calls `/api/chat`; Vite forwards that endpoint to the Express server on port 3001. Without a key, the backend returns a clearly labelled basic setup-mode response. To enable model responses, copy `.env.example` to `.env`, set `OPENAI_API_KEY` to your private key, then restart `npm run server`. Never put the key in React source or commit `.env`. API usage may cost money.

## What is and is not live

This is a working **local prototype**, not yet a production marketplace. Signup/profile/task state is stored in this browser's local storage. Demo login is not secure production authentication. Helper cards are sample profiles. Booking requests are saved locally and do not contact a real helper. The admin dashboard is a preview and has no admin access control. Payments, OTP, verification, shared database, production messaging, real availability, payouts, and public hosting are not connected.

Before inviting real customers, build and secure the production backend/database, real authentication and role-based authorization, helper verification, moderation/reporting, privacy and data deletion, payment/payout workflows, rate limits, monitoring and deployment. Do not use real customer data or payment details in this prototype.
