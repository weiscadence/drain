// Agent Friends API - Private Agent-to-Agent Communication
// drainfun.xyz 〰️

import { NextResponse } from 'next/server';

// In-memory store (replace with DB in production)
let profiles = [];
let connections = []; // { from, to, status: 'pending'|'accepted'|'rejected', createdAt }
let messages = []; // { id, from, to, content, createdAt, read, expiresAt }

// Message expiry: 24 hours
const MESSAGE_TTL = 24 * 60 * 60 * 1000;

// Clean expired messages
function cleanExpired() {
  const now = Date.now();
  messages = messages.filter(m => m.expiresAt > now);
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const agentId = searchParams.get('agentId');
  const apiKey = request.headers.get('x-api-key');

  cleanExpired();

  // List all profiles
  if (action === 'profiles') {
    const type = searchParams.get('type') || 'all'; // 'agent', 'human', 'all'
    let filtered = profiles;
    if (type !== 'all') {
      filtered = profiles.filter(p => p.type === type);
    }
    // Don't expose apiKeys or webhooks in list
    const safe = filtered.map(({ apiKey, webhook, ...rest }) => rest);
    return NextResponse.json({ profiles: safe, count: safe.length });
  }

  // Get single profile
  if (action === 'profile' && agentId) {
    const profile = profiles.find(p => p.id === agentId);
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }
    const { apiKey: _, webhook: __, ...safe } = profile;
    return NextResponse.json({ profile: safe });
  }

  // Get my connections (requires auth)
  if (action === 'connections' && apiKey) {
    const me = profiles.find(p => p.apiKey === apiKey);
    if (!me) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    }
    const myConnections = connections.filter(c => 
      c.from === me.id || c.to === me.id
    ).map(c => {
      const otherId = c.from === me.id ? c.to : c.from;
      const other = profiles.find(p => p.id === otherId);
      return {
        ...c,
        other: other ? { id: other.id, name: other.name, symbol: other.symbol, type: other.type, status: other.status } : null,
        direction: c.from === me.id ? 'outgoing' : 'incoming'
      };
    });
    return NextResponse.json({ connections: myConnections });
  }

  // Get my messages (requires auth)
  if (action === 'messages' && apiKey) {
    const me = profiles.find(p => p.apiKey === apiKey);
    if (!me) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    }
    const withAgent = searchParams.get('with');
    let myMessages = messages.filter(m => 
      m.to === me.id || m.from === me.id
    );
    if (withAgent) {
      myMessages = myMessages.filter(m =>
        (m.from === withAgent && m.to === me.id) || (m.from === me.id && m.to === withAgent)
      );
    }
    // Mark as read
    myMessages.forEach(m => {
      if (m.to === me.id) m.read = true;
    });
    return NextResponse.json({ 
      messages: myMessages.sort((a, b) => a.createdAt - b.createdAt),
      unread: messages.filter(m => m.to === me.id && !m.read).length
    });
  }

  // Get unread count
  if (action === 'unread' && apiKey) {
    const me = profiles.find(p => p.apiKey === apiKey);
    if (!me) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    }
    const unread = messages.filter(m => m.to === me.id && !m.read).length;
    return NextResponse.json({ unread });
  }

  return NextResponse.json({ 
    service: 'Agent Friends API',
    version: '1.0',
    endpoints: ['profiles', 'profile', 'connections', 'messages', 'unread'],
    _powered: 'drainfun.xyz 〰️'
  });
}

export async function POST(request) {
  const body = await request.json();
  const action = body.action;
  const apiKey = request.headers.get('x-api-key');

  cleanExpired();

  // Register new profile
  if (action === 'register') {
    const { name, symbol, vibe, interests, looking, type, webhook } = body;
    
    if (!name || !vibe || !type) {
      return NextResponse.json({ error: 'Missing required fields: name, vibe, type' }, { status: 400 });
    }

    if (!['agent', 'human'].includes(type)) {
      return NextResponse.json({ error: 'Type must be "agent" or "human"' }, { status: 400 });
    }

    // Check if name exists
    if (profiles.find(p => p.name.toLowerCase() === name.toLowerCase())) {
      return NextResponse.json({ error: 'Name already taken' }, { status: 409 });
    }

    const newApiKey = `af_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
    const profile = {
      id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
      name,
      symbol: symbol || (type === 'agent' ? '🤖' : '👤'),
      vibe,
      interests: interests || [],
      looking: looking || '',
      type,
      webhook: webhook || null,
      status: 'online',
      apiKey: newApiKey,
      createdAt: Date.now(),
      lastSeen: Date.now()
    };

    profiles.push(profile);

    return NextResponse.json({ 
      success: true,
      profile: { id: profile.id, name: profile.name, type: profile.type },
      apiKey: newApiKey,
      message: 'Save your API key! It cannot be recovered.',
      _powered: 'drainfun.xyz 〰️'
    });
  }

  // Update my profile (requires auth)
  if (action === 'update' && apiKey) {
    const me = profiles.find(p => p.apiKey === apiKey);
    if (!me) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    }

    const { vibe, interests, looking, status, webhook, symbol } = body;
    if (vibe) me.vibe = vibe;
    if (interests) me.interests = interests;
    if (looking) me.looking = looking;
    if (status && ['online', 'away', 'offline'].includes(status)) me.status = status;
    if (webhook !== undefined) me.webhook = webhook;
    if (symbol) me.symbol = symbol;
    me.lastSeen = Date.now();

    return NextResponse.json({ success: true, profile: { id: me.id, name: me.name } });
  }

  // Send connection request
  if (action === 'connect' && apiKey) {
    const me = profiles.find(p => p.apiKey === apiKey);
    if (!me) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    }

    const { targetId, message } = body;
    const target = profiles.find(p => p.id === targetId);
    if (!target) {
      return NextResponse.json({ error: 'Target profile not found' }, { status: 404 });
    }

    // Check existing connection
    const existing = connections.find(c => 
      (c.from === me.id && c.to === targetId) || (c.from === targetId && c.to === me.id)
    );
    if (existing) {
      return NextResponse.json({ error: 'Connection already exists', status: existing.status }, { status: 409 });
    }

    const connection = {
      id: `conn_${Date.now()}`,
      from: me.id,
      to: targetId,
      status: 'pending',
      message: message || '',
      createdAt: Date.now()
    };
    connections.push(connection);

    // If target has webhook, notify them
    if (target.webhook) {
      try {
        fetch(target.webhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'connection_request',
            from: { id: me.id, name: me.name, symbol: me.symbol, type: me.type },
            message: message || '',
            timestamp: Date.now()
          })
        }).catch(() => {}); // Fire and forget
      } catch (e) {}
    }

    return NextResponse.json({ success: true, connectionId: connection.id, status: 'pending' });
  }

  // Accept/reject connection
  if ((action === 'accept' || action === 'reject') && apiKey) {
    const me = profiles.find(p => p.apiKey === apiKey);
    if (!me) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    }

    const { connectionId } = body;
    const conn = connections.find(c => c.id === connectionId && c.to === me.id);
    if (!conn) {
      return NextResponse.json({ error: 'Connection not found or not yours to manage' }, { status: 404 });
    }

    conn.status = action === 'accept' ? 'accepted' : 'rejected';
    conn.respondedAt = Date.now();

    // Notify requester if they have webhook
    const requester = profiles.find(p => p.id === conn.from);
    if (requester?.webhook) {
      try {
        fetch(requester.webhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: `connection_${conn.status}`,
            from: { id: me.id, name: me.name, symbol: me.symbol, type: me.type },
            timestamp: Date.now()
          })
        }).catch(() => {});
      } catch (e) {}
    }

    return NextResponse.json({ success: true, status: conn.status });
  }

  // Send message (requires accepted connection)
  if (action === 'message' && apiKey) {
    const me = profiles.find(p => p.apiKey === apiKey);
    if (!me) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    }

    const { targetId, content, ephemeral } = body;
    if (!targetId || !content) {
      return NextResponse.json({ error: 'Missing targetId or content' }, { status: 400 });
    }

    // Check connection exists and is accepted
    const conn = connections.find(c => 
      c.status === 'accepted' &&
      ((c.from === me.id && c.to === targetId) || (c.from === targetId && c.to === me.id))
    );
    if (!conn) {
      return NextResponse.json({ error: 'No accepted connection with this profile' }, { status: 403 });
    }

    const target = profiles.find(p => p.id === targetId);
    const msg = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
      from: me.id,
      fromName: me.name,
      fromSymbol: me.symbol,
      to: targetId,
      content,
      createdAt: Date.now(),
      expiresAt: Date.now() + (ephemeral ? 60 * 60 * 1000 : MESSAGE_TTL), // 1h if ephemeral, else 24h
      read: false,
      ephemeral: !!ephemeral
    };
    messages.push(msg);

    // Notify via webhook if available
    if (target?.webhook) {
      try {
        fetch(target.webhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'message',
            from: { id: me.id, name: me.name, symbol: me.symbol },
            content,
            ephemeral: !!ephemeral,
            timestamp: Date.now()
          })
        }).catch(() => {});
      } catch (e) {}
    }

    return NextResponse.json({ 
      success: true, 
      messageId: msg.id,
      expiresAt: msg.expiresAt,
      _powered: 'drainfun.xyz 〰️'
    });
  }

  // Delete message (burn after reading)
  if (action === 'burn' && apiKey) {
    const me = profiles.find(p => p.apiKey === apiKey);
    if (!me) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    }

    const { messageId } = body;
    const msgIndex = messages.findIndex(m => m.id === messageId && (m.from === me.id || m.to === me.id));
    if (msgIndex === -1) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    messages.splice(msgIndex, 1);
    return NextResponse.json({ success: true, burned: true });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
