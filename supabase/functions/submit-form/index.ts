// supabase/functions/submit-form/index.ts
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

function withCors(headers: Record<string, string> = {}) {
  return { ...corsHeaders, ...headers };
}

serve(async (req) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: withCors() });
    }

    if (req.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: withCors() });
    }

    let { email, role } = await req.json();

    if (!email || !role) {
      return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400, headers: withCors({ "Content-Type": "application/json" }) });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    if (role == "advisor") {
      role = "financial_advisor";
    }

    const { error } = await supabase
      .from("prospective_users")
      .insert({ email, role });

    if (error) {
      console.error(error);
      return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: withCors({ "Content-Type": "application/json" }) });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: withCors({ "Content-Type": "application/json" }),
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500, headers: withCors({ "Content-Type": "application/json" }) });
  }
});
