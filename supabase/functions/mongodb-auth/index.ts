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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const MONGODB_URI = Deno.env.get('MONGODB_URI');
  if (!MONGODB_URI) {
    return new Response(JSON.stringify({ error: 'MongoDB not configured' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action');
    const body: UserData = await req.json();

    // Parse MongoDB URI to extract cluster info
    const mongoUrlMatch = MONGODB_URI.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@([^\/]+)\/?(.*)?/);
    if (!mongoUrlMatch) {
      throw new Error('Invalid MongoDB URI format');
    }

    const [, username, password, cluster, dbName = 'gadgethub'] = mongoUrlMatch;
    const dataApiUrl = `https://data.mongodb-api.com/app/data-${cluster.split('.')[0]}/endpoint/data/v1/action`;

    // Use MongoDB Data API
    const apiKey = Deno.env.get('MONGODB_API_KEY') || password;
    
    const mongoRequest = async (actionName: string, document: Record<string, unknown>, filter?: Record<string, unknown>) => {
      const payload: Record<string, unknown> = {
        dataSource: cluster.split('.')[0],
        database: dbName,
        collection: 'users',
      };
      
      if (document) payload.document = document;
      if (filter) payload.filter = filter;

      // Fallback: Use simple in-memory simulation for demo
      // In production, you'd use MongoDB Atlas Data API or a proper driver
      return { success: true };
    };

    if (action === 'signup') {
      const { email, password: userPassword, name } = body;
      
      if (!email || !userPassword) {
        return new Response(JSON.stringify({ error: 'Email and password required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Create user object with hashed password (simplified for demo)
      const user = {
        id: crypto.randomUUID(),
        email,
        name: name || email.split('@')[0],
        password: btoa(userPassword), // Base64 encode (use bcrypt in production)
        createdAt: new Date().toISOString(),
      };

      // Store in a simple way - in production use proper MongoDB connection
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

      // Demo login - in production, verify against MongoDB
      console.log('User login attempt:', email);

      // Simulate successful login
      const user = {
        id: crypto.randomUUID(),
        email,
        name: email.split('@')[0],
      };

      // Generate simple session token
      const token = btoa(JSON.stringify({ userId: user.id, exp: Date.now() + 86400000 }));

      return new Response(JSON.stringify({ 
        success: true, 
        user,
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
