# LifeFix — AI Chat Update

This is the updated LifeFix project, based on the existing React + Vite frontend. The chat now sends messages to a backend endpoint, preserves chat history in this browser, shows loading/errors, includes example prompts, and can prepare a task draft for the task form.

## Start it (one-time dependency install)

1. Extract the ZIP into your existing LifeFix project folder (or keep it as this complete updated folder).
2. Open Terminal/Command Prompt in this folder and run:
   ```bash
   npm install
   ```
3. Start the backend in one terminal:
   ```bash
   npm run server
   ```
4. Start the website in a second terminal:
   ```bash
   npm run dev
   ```
5. Open the Vite URL printed in the terminal, normally `http://localhost:5173`.

Keep both processes running while testing. You do not need to reinstall dependencies every time; next time, just start the two processes again.

## Enable the live AI model

The chat works in setup mode without an API key, using a basic local task helper. To enable actual AI responses:

1. Copy `.env.example` to a new file named `.env` in this folder.
2. Add your private API key to `OPENAI_API_KEY=` in `.env`.
3. Save the file and restart `npm run server`.

Never paste the API key into `src/main.tsx`, the browser, screenshots, or public GitHub. API usage may incur charges according to your provider/account. The backend reports whether AI is configured at `http://localhost:3001/api/health`.

## Important current limits

- Chat history is saved in this browser only; it is not yet stored in a shared database.
- Task drafts are suggestions; the user must review and submit them. The AI does not book a helper or charge money.
- Authentication, OTP, payment processing, real helper matching, persistent multi-user chat, moderation/admin controls, and production hosting still require further implementation.
- Before public launch, add rate limiting, authentication, validation, abuse protection, privacy controls, and a production deployment configuration.
