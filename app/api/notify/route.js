// DrainFun Bot Notifications
// Telegram bot: @DrainFunbot — token: 8593110001:AAH4BSshNJSqd9_o4fNVGvRFcwkkASpwu94
// Stores registered users + sends match alerts when new tokens pile up

import fs from 'fs';
import path from 'path';

const BOT_TOKEN = process.env.DRAINBOT_TOKEN || '8593110001:AAH4BSshNJSqd9_o4fNVGvRFcwkkASpwu94';
const USERS_FILE = path.join(process.cwd(), 'data/drain-users.json');

function loadUsers() {
  try { return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8')); }
  catch { return {}; }
}

function saveUsers(users) {
  try {
    fs.mkdirSync(path.dirname(USERS_FILE), { recursive: true });
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch {}
}

async function sendTelegramMessage(chatId, text, parse_mode = 'HTML') {
  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode,
      disable_web_page_preview: true,
    }),
  });
  return res.json();
}

// GET /api/notify?action=register&telegramId=123&username=jiggy
// GET /api/notify?action=broadcast&token=secret&message=...
// POST /api/notify — register user from Telegram WebApp
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  if (action === 'register') {
    const telegramId = searchParams.get('telegramId');
    const username = searchParams.get('username') || '';
    const firstName = searchParams.get('firstName') || '';
    if (!telegramId) return Response.json({ error: 'telegramId required' }, { status: 400 });

    const users = loadUsers();
    users[telegramId] = {
      telegramId,
      username,
      firstName,
      registeredAt: users[telegramId]?.registeredAt || Date.now(),
      lastActiveAt: Date.now(),
      notifyEnabled: true,
    };
    saveUsers(users);

    return Response.json({ success: true, registered: telegramId });
  }

  if (action === 'count') {
    const users = loadUsers();
    return Response.json({ count: Object.keys(users).length });
  }

  return Response.json({ error: 'unknown action' }, { status: 400 });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, telegramId, username, firstName, tokens, adminKey } = body;

    // Register user
    if (action === 'register') {
      if (!telegramId) return Response.json({ error: 'telegramId required' }, { status: 400 });
      const users = loadUsers();
      const isNew = !users[telegramId];
      users[telegramId] = {
        telegramId,
        username: username || users[telegramId]?.username || '',
        firstName: firstName || users[telegramId]?.firstName || '',
        registeredAt: users[telegramId]?.registeredAt || Date.now(),
        lastActiveAt: Date.now(),
        notifyEnabled: true,
      };
      saveUsers(users);

      // Welcome message for new users
      if (isNew) {
        await sendTelegramMessage(
          telegramId,
          `🌊 <b>Welcome to Drain!</b>\n\nYou're in. I'll ping you when hot tokens drop or when your watchlist has new matches.\n\n<a href="https://drainfun.xyz/swipe">Open Drain App →</a>`,
        ).catch(() => {});
      }

      return Response.json({ success: true, isNew });
    }

    // Broadcast new matches alert to all users
    if (action === 'broadcast_matches') {
      if (adminKey !== process.env.ADMIN_KEY && adminKey !== 'drain_admin_2026') {
        return Response.json({ error: 'unauthorized' }, { status: 401 });
      }
      const users = loadUsers();
      const activeUsers = Object.values(users).filter(u => u.notifyEnabled);
      const tokenList = (tokens || []).slice(0, 5).map(t => `• <b>$${t.symbol}</b> ${t.change >= 0 ? '+' : ''}${t.change?.toFixed(0)}% · ${t.attentionTag || ''}`).join('\n');
      const msg = `🔥 <b>New Drain Matches!</b>\n\n${tokenList}\n\n<a href="https://drainfun.xyz/swipe">Swipe now →</a>`;

      let sent = 0;
      for (const user of activeUsers.slice(0, 100)) {
        try {
          await sendTelegramMessage(user.telegramId, msg);
          sent++;
          await new Promise(r => setTimeout(r, 50)); // rate limit
        } catch {}
      }
      return Response.json({ success: true, sent, total: activeUsers.length });
    }

    // Send individual alert
    if (action === 'alert') {
      if (!telegramId) return Response.json({ error: 'telegramId required' }, { status: 400 });
      const message = body.message || '🌊 New alpha on Drain!';
      const result = await sendTelegramMessage(telegramId, message);
      return Response.json({ success: true, result });
    }

    return Response.json({ error: 'unknown action' }, { status: 400 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
