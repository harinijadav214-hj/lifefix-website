import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = Number(process.env.PORT || 3001);
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '40kb' }));

const SYSTEM_PROMPT = `You are LifeFix AI, a friendly assistant for the LifeFix everyday-task marketplace. Help users describe tasks clearly, ask at most one useful follow-up question at a time, and suggest a likely category from: Home Services, Technology, Student Help, Shopping & Errands, Creative, Vehicle, Care & Support, Other. Never claim a helper is verified, available, booked, or priced unless the system explicitly provides that data. Do not make bookings, take payments, or claim you have posted a task. If the user has provided enough details, summarize the task in a concise copy-ready format with task, category, when (if given), and location (if given), then say they can continue to the task form. Ask only for details needed to clarify the request; don't ask for sensitive information. Keep responses warm, practical, and brief.`;
function fallbackReply(messages) {
  const last = String(messages.at(-1)?.content || '').trim();
  const lower = last.toLowerCase();
  let category = 'Other';
  if (/clean|plumb|electric|repair|paint|move|furniture|house|home/.test(lower)) category = 'Home Services';
  else if (/laptop|computer|phone|wifi|software|technical|tech/.test(lower)) category = 'Technology';
  else if (/student|assignment|tutor|study|project|notes/.test(lower)) category = 'Student Help';
  else if (/shop|grocery|pickup|pick up|errand|delivery/.test(lower)) category = 'Shopping & Errands';
  else if (/design|photo|video|logo|creative|edit/.test(lower)) category = 'Creative';
  else if (/car|bike|vehicle|tyre|tire/.test(lower)) category = 'Vehicle';
  else if (/elder|care|companion|senior/.test(lower)) category = 'Care & Support';
  const enough = last.length > 45 || /tomorrow|today|weekend|need someone|looking for/.test(lower);
  if (!last) return { reply: 'Tell me what you need help with, and I’ll help you make a clear task request.' };
  if (!enough) return { reply: `I can help with that. Which ${category === 'Other' ? 'kind of task' : 'details'} should the helper know—for example, what exactly needs doing and when do you need it?` };
  const taskDraft = `Task: ${last}\nSuggested category: ${category}\nPlease confirm the date, time, and service location in the task form.`;
  return { reply: `Here’s a starting point for your request.\n\n${taskDraft}\n\nI’m running in setup mode, so this is a basic local assistant rather than the live AI model. You can continue to the task form and edit the details.`, taskDraft };
}

app.get('/api/health', (_req, res) => res.json({ ok: true, aiConfigured: Boolean(process.env.OPENAI_API_KEY) }));
app.post('/api/chat', async (req, res) => {
  const messages = Array.isArray(req.body?.messages) ? req.body.messages.slice(-12) : [];
  const safeMessages = messages.filter(m => ['user', 'assistant'].includes(m?.role) && typeof m?.content === 'string').map(m => ({ role: m.role, content: m.content.slice(0, 3000) }));
  if (!safeMessages.length || safeMessages.at(-1)?.role !== 'user') return res.status(400).json({ error: 'Please send a message first.' });
  if (!process.env.OPENAI_API_KEY) return res.json({ ...fallbackReply(safeMessages), mode: 'setup' });
  try {
    const upstream = await fetch(process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1/chat/completions', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({ model: process.env.OPENAI_MODEL || 'gpt-4o-mini', temperature: 0.5, messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...safeMessages] }),
      signal: AbortSignal.timeout(30000)
    });
    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) return res.status(502).json({ error: data?.error?.message || 'The AI provider could not answer. Check the API key and model settings.' });
    const reply = data?.choices?.[0]?.message?.content;
    if (typeof reply !== 'string' || !reply.trim()) throw new Error('Empty AI response');
    const draftMatch = reply.match(/(?:Task draft|Task summary|Ready to post)\s*:?\s*\n([\s\S]{15,700})/i);
    return res.json({ reply: reply.trim(), ...(draftMatch ? { taskDraft: draftMatch[1].trim() } : {}), mode: 'ai' });
  } catch (err) {
    console.error('LifeFix AI request failed:', err?.message || err);
    return res.status(502).json({ error: 'LifeFix could not reach the AI provider. Please try again shortly.' });
  }
});
app.listen(port, () => console.log(`LifeFix API listening on http://localhost:${port}`));
