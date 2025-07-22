import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, createServerSupabase } from '../../../../lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email, name, password, role } = await request.json()

    // Verify the requesting user is a super admin
    const supabase = createServerSupabase()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is super admin
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('role')
      .eq('auth_user_id', user.id)
      .single()

    if (adminError || !adminUser || adminUser.role !== 'super_admin') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Create auth user using admin client
    const { data: authData, error: createAuthError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    })

    if (createAuthError) {
      return NextResponse.json({ error: createAuthError.message }, { status: 400 })
    }

    // Create admin user record
    const { error: adminInsertError } = await supabaseAdmin
      .from('admin_users')
      .insert({
        email,
        name,
        role,
        auth_user_id: authData.user.id,
        created_by: adminUser.id
      })

    if (adminInsertError) {
      // If admin user creation fails, clean up the auth user
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json({ error: adminInsertError.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, user: authData.user })
  } catch (error: any) {
    console.error('Error creating user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}