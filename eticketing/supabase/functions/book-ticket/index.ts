import { serve } from 'std/server';
import { json } from 'std/http';

serve(async (req) => {
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  const { user_name, user_phone, user_email, event_date } = await req.json();

  if (!user_name || !user_phone || !event_date) {
    return json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const response = await fetch('https://your-supabase-url/rest/v1/rpc/book_ticket', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer YOUR_SUPABASE_ANON_KEY`,
      },
      body: JSON.stringify({
        p_user_name: user_name,
        p_user_phone: user_phone,
        p_user_email: user_email,
        p_event_date: event_date,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return json({ error: errorData.message }, { status: response.status });
    }

    const data = await response.json();
    return json(data, { status: 200 });
  } catch (error) {
    return json({ error: 'Internal server error' }, { status: 500 });
  }
});