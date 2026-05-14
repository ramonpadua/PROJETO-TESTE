import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Authenticate the requestor
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Authorization header missing')
    }

    const supabaseUserClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } },
    )

    const {
      data: { user: requestor },
      error: userError,
    } = await supabaseUserClient.auth.getUser()

    if (userError || !requestor) {
      throw new Error('Unauthorized')
    }

    // 2. Get requestor's organization
    const { data: requestorProfile, error: profileError } = await supabaseUserClient
      .from('users')
      .select('organization_id')
      .eq('id', requestor.id)
      .single()

    if (profileError || !requestorProfile?.organization_id) {
      throw new Error('Organization not found for user')
    }

    // 3. Create the new user in the same organization
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { email, password, role, name } = await req.json()

    if (!email || !password) {
      throw new Error('Email e senha são obrigatórios')
    }

    const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name: name || '',
        organization_id: requestorProfile.organization_id,
        role: role || 'vendedor',
      },
    })

    if (createError) throw createError

    return new Response(JSON.stringify(userData), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
      status: 200,
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
      status: 400,
    })
  }
})
