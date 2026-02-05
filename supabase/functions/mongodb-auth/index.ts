import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UserData {
  email: string;
  password: string;
  name?: string;
}

// Simple in-memory store for demo (in production, use proper MongoDB Data API)
// This persists across function invocations within the same instance
const users = new Map<string, { id: string; email: string; name: string; passwordHash: string; createdAt: string }>();

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action');
    const body: UserData = await req.json();

    if (action === 'signup') {
      const { email, password: userPassword, name } = body;
      
      if (!email || !userPassword) {
        return new Response(JSON.stringify({ error: 'Email and password required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Check if user already exists
      if (users.has(email.toLowerCase())) {
        return new Response(JSON.stringify({ error: 'User already exists. Please login instead.' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Create user object with hashed password
      const user = {
        id: crypto.randomUUID(),
        email: email.toLowerCase(),
        name: name || email.split('@')[0],
        passwordHash: btoa(userPassword), // Base64 encode (use bcrypt in production)
        createdAt: new Date().toISOString(),
      };

      // Store user
      users.set(email.toLowerCase(), user);
      console.log('User signup:', { email, name: user.name });

      return new Response(JSON.stringify({ 
        success: true, 
        user: { id: user.id, email: user.email, name: user.name } 
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else if (action === 'login') {
      const { email, password: userPassword } = body;
      
      if (!email || !userPassword) {
        return new Response(JSON.stringify({ error: 'Email and password required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Find user
      const storedUser = users.get(email.toLowerCase());
      
      if (!storedUser) {
        console.log('Login failed - user not found:', email);
        return new Response(JSON.stringify({ 
          error: 'User not found. Please sign up first.' 
        }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Verify password
      if (storedUser.passwordHash !== btoa(userPassword)) {
        console.log('Login failed - wrong password:', email);
        return new Response(JSON.stringify({ 
          error: 'Invalid password. Please try again.' 
        }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log('User login success:', email);

      // Generate simple session token
      const token = btoa(JSON.stringify({ userId: storedUser.id, exp: Date.now() + 86400000 }));

      return new Response(JSON.stringify({ 
        success: true, 
        user: { id: storedUser.id, email: storedUser.email, name: storedUser.name },
        token,
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else {
      return new Response(JSON.stringify({ error: 'Invalid action' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error: unknown) {
    console.error('Auth error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
